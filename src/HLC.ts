import * as Interface from "./Interface.js";

/**
 * A Hybrid Logical Clock (HLC) to track the order of events in a distributed
 * system.
 *
 * @remark Not thread safe. (does not matter in browsers!)
 *
 * @remark Assumptions
 * 1. Your node uses NTP Sync.
 * 2. Clocks are monotonicly increasing
 *
 * @remark Properties
 * 1. Monotonically increasing
 * 2. if hl1.equals(hl2) then we have no idea about the order of events
 * 3. if event `e` is before event `f` for node `p` (`p.e < p.f`)
 * and event `f` is before event `i` on node `l` (`l.f < l.i`) then
 * when the nodes are synced `p.f < p.i` is guaranteed.
 *
 *
 * @example
 * Instantiate a singelton in your system like so:
 * ```ts
 * const Clock = new HybridLogicalClock(() => new Date())
 *
 * ```
 * @remark You will have to persist the HLC
 *
 * @remark It can not tell you when something happened since the system clock in a node
 * could be incorrect. But can be used to order events as they are received at a node.
 *
 * @remark Based on the implmentation by [Martic Fowler]{@link https://martinfowler.com/articles/patterns-of-distributed-systems/hybrid-clock.html}
 */
export default class HybridLogicalClock {
  private readonly getTimestamp;
  private latestTime: HLTimestamp;
  constructor(getTimestamp: () => Date) {
    this.getTimestamp = getTimestamp;
    this.latestTime = new HLTimestamp(this.getTimestamp(), 0);
  }

  /**
   *
   * @returns the latest timestamp in the system (that we know of)
   */
  public now(): HLTimestamp {
    const tNow = this.getTimestamp();
    if (this.latestTime.timestamp >= tNow) {
      this.latestTime = this.latestTime.addTicks(1);
    } else {
      this.latestTime = new HLTimestamp(tNow, 0);
    }
    return this.latestTime;
  }

  /**
   *
   * @param requestTime - the rev´ceived request time from another node
   * @returns the latest (known) tiemstamp of the distributed system.
   */
  public tick(requestTime: HLTimestamp): HLTimestamp {
    //set ticks to -1, so that, if this is the max, the next addTicks reset it to zero.
    const now = new HLTimestamp(this.getTimestamp(), -1);
    this.latestTime = Interface.ICanMax.max(now, requestTime, this.latestTime);
    this.latestTime = this.latestTime.addTicks(1);
    return this.latestTime;
  }
}

/**
 * Hybrid Logical Timestamp
 */
export class HLTimestamp
  implements
    Interface.ICanCompare<HLTimestamp>,
    Interface.ICanMax<HLTimestamp>,
    Interface.ICanEqual<HLTimestamp>
{
  private readonly _timestamp: Date;
  private readonly _tick: number;
  constructor(timestamp: Date, tick: number) {
    this._timestamp = timestamp;
    this._tick = tick;
  }

  public equals(other: HLTimestamp): boolean {
    return this.compareTo(other) === 0;
  }

  public compareTo(other: HLTimestamp): number {
    const thisMilli = this.timestamp.valueOf();
    const otherMilli = other.timestamp.valueOf();
    if (thisMilli === otherMilli) {
      return this.tick - other.tick;
    }
    return thisMilli - otherMilli;
  }

  public max(other: HLTimestamp): HLTimestamp {
    return this.compareTo(other) > 0 ? this : other;
  }

  /**
   * get the timestamp
   */
  public get timestamp(): Date {
    return this._timestamp;
  }

  /**
   * Get the tick
   */
  public get tick(): number {
    return this._tick;
  }

  /**
   * Increment the ticks by a given amount.
   *
   * @param ticks - the number of ticks to increment by
   * @returns a new HLTimestamp the the tick incremented by ticks
   */
  public addTicks(ticks: number): HLTimestamp {
    return new HLTimestamp(this.timestamp, this.tick + ticks);
  }

  /**
   * Increment the ticks.
   *
   * @remark Equvalent to calling
   * ```ts
   * hlt.addTicks(1)
   * ```
   *
   * @returns a new HLTimestamp the the tick incremented by one
   */
  public addTick(): HLTimestamp {
    return new HLTimestamp(this.timestamp, this.tick + 1);
  }
}
