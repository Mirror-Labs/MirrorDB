export * from "./Builder";
export * from "./TrippleType";

import { TrippleType } from "./TrippleType";

export class Schema implements Iterable<[string, TrippleType]> {
  private _trippleTypes: Map<string, TrippleType>;

  constructor(init: Record<string, TrippleType> | Map<string, TrippleType>) {
    this._trippleTypes = new Map(Object.entries(init));
  }

  [Symbol.iterator](): Iterator<[string, TrippleType], any, undefined> {
    return this._trippleTypes.entries();
  }

  /**
   * @param attr - the attribute you want the `TrippleType` of
   * @return a `TrippleType` if it exists, otherwise undefined
   */
  find(attr: string): TrippleType | undefined {
    return this._trippleTypes.get(attr);
  }

  /**
   *
   * @param other - the schema you want to join
   * @returns a new schema that is the unioin of the two.
   */
  join(other: Schema): Schema {
    const jointSchema: Map<string, TrippleType> = new Map(this._trippleTypes);

    for (const [attr, trippleType] of other) {
      const mTrippleType = jointSchema.get(attr);

      if (mTrippleType === undefined) {
        jointSchema.set(attr, trippleType);
      } else {
        jointSchema.set(attr, trippleType.join(mTrippleType));
      }
    }
    return new Schema(jointSchema);
  }

  equals(other: Schema): boolean {
    if (this._trippleTypes.size !== other._trippleTypes.size) {
      return false;
    } else {
      for (const [attr, trippleType] of other) {
        const mTrippleType = this.find(attr);
        if (mTrippleType === undefined || mTrippleType.equals(trippleType)) {
          return false;
        }
      }
    }
    return true;
  }
}
