import test from "ava";
import HLC, { HLTimestamp } from "./HLC.js";

////////////////////////////////////////////////////////////////////////////////
// HLC
////////////////////////////////////////////////////////////////////////////////

// A fake clock
const createClock = () => {
  let time = 0;
  return () => {
    time = time + 1000;
    return new Date(time);
  };
};

test("HLC.now: two timestamps are always after each other (simple)", (t) => {
  const hlc = new HLC(createClock());
  const ts1 = hlc.now();
  const ts2 = hlc.now();
  t.true(ts1.compareTo(ts2) < 0);
});

test("HLC.now: two timestamps are always after each other (complex)", (t) => {
  const hlc1 = new HLC(createClock());
  const hlc2 = new HLC(createClock());
  hlc2.now();
  hlc2.now();
  hlc2.now();
  const hlc2_ts4 = hlc2.now();
  hlc1.now();
  const hlc1_ts2 = hlc1.tick(hlc2_ts4);

  t.true(hlc1_ts2.compareTo(hlc2_ts4) > 0);
});

////////////////////////////////////////////////////////////////////////////////
// HLTimestamp
////////////////////////////////////////////////////////////////////////////////

// equals
test("HLTimestamp.equals: is equal to itself", (t) => {
  const ts1 = new HLTimestamp(new Date(500000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 0);
  t.true(ts1.equals(ts2));
});

test("HLTimestamp.equals: is not equal if the logic part is different", (t) => {
  const ts1 = new HLTimestamp(new Date(500000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 1);
  t.false(ts1.equals(ts2));
});

test("HLTimestamp.equals: is not equal if the time is different", (t) => {
  const ts1 = new HLTimestamp(new Date(510000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 0);
  t.false(ts1.equals(ts2));
});

// compareTo

test("HLTimestamp.compareTo: is equal to itself", (t) => {
  const ts1 = new HLTimestamp(new Date(500000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 0);
  t.is(ts1.compareTo(ts2), 0);
});

test("HLTimestamp.compareTo: larger logic part is larger", (t) => {
  const ts1 = new HLTimestamp(new Date(500000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 1);
  t.true(ts1.compareTo(ts2) < 0);
});

test("HLTimestamp.compareTo: larger time is larger", (t) => {
  const ts1 = new HLTimestamp(new Date(510000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 0);
  t.true(ts1.compareTo(ts2) > 0);
});

// max

test("HLTimestamp.max: when both are identical", (t) => {
  const ts1 = new HLTimestamp(new Date(500000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 0);
  t.true(ts1.max(ts2).equals(ts1));
});

test("HLTimestamp.max: when logic part is larger", (t) => {
  const ts1 = new HLTimestamp(new Date(500000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 1);
  t.true(ts1.max(ts2).equals(ts2));
});

test("HLTimestamp.max: when timestamp is larger", (t) => {
  const ts1 = new HLTimestamp(new Date(510000000000), 0);
  const ts2 = new HLTimestamp(new Date(500000000000), 0);
  t.true(ts1.max(ts2).equals(ts1));
});
