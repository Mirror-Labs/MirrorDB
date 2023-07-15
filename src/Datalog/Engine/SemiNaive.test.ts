import test from "ava";
import { TrippleFact } from "../Types.js";
import { exec, Query } from "./SemiNaive.js";

test("exec should return empty list for empty facts", (ctx) => {
  const facts: TrippleFact[] = [];
  const query: Query = { find: ["?x"], where: [["a", "has", "?x"]] };
  ctx.deepEqual(exec(facts, query), []);
});

test("exec should return one matching fact", (ctx) => {
  const facts: TrippleFact[] = [
    new TrippleFact("a", "has", 42),
    new TrippleFact("b", "has", 1337),
  ];
  const query: Query = { find: ["?x"], where: [["a", "has", "?x"]] };
  ctx.deepEqual(exec(facts, query), [new Map().set("?x", 42)]);
});

// test("exec should return multiple matching facts", (ctx) => {
//   const facts: TrippleFact[] = [
//     new TrippleFact("a", "has", 42),
//     new TrippleFact("b", "has", 1337),
//     new TrippleFact("a", "has", 43),
//   ];
//   const query: Query = { find: ["?x"], where: [["a", "has", "?x"]] };
//   ctx.deepEqual(exec(facts, query), [new Map().set("?x", 42)]);
// });
