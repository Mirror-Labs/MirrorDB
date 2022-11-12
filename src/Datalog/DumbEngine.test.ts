import test from "ava";
import * as DumbEngine from "./DumbEngine.js";
import * as Examples from "./Examples.js";

const DB1 = DumbEngine.createDB(Examples.DB1);

// matchPattern

test("DumbEngine.matchPattern: can match a single pattern", (t) => {
  const result = DumbEngine.matchPattern(
    ["?id", "movie/title", "The Terminator"],
    ["some-random-id", "movie/title", "The Terminator"],
    {}
  );
  t.deepEqual(result, { "?id": "some-random-id" });
});

test("DumbEngine.matchPattern: won't match on incorrect pattern", (t) => {
  const result = DumbEngine.matchPattern(
    ["?id", "movie/title", "The Terminator"],
    ["some-random-id", "movie/title", "The Landslide"],
    {}
  );
  t.deepEqual(result, undefined);
});

// querySingle

test("DumbEngine.querySingle: can match a single pattern on DB1", (t) => {
  const result = DumbEngine.querySingle(
    ["?id", "movie/title", "The Terminator"],
    DB1,
    {}
  );
  t.deepEqual(result, [{ "?id": Examples.ids.theTerminatorID }]);
});

// queryWhere

test("DumbEngine.queryWhere: can match a single pattern on DB1", (t) => {
  const result = DumbEngine.queryWhere(
    [["?id", "movie/title", "The Terminator"]],
    DB1
  );
  t.deepEqual(result, [{ "?id": Examples.ids.theTerminatorID }]);
});

test("DumbEngine.queryWhere: can match a multi pattern on DB1", (t) => {
  const result = DumbEngine.queryWhere(
    [
      ["?movieId", "movie/title", "The Terminator"],
      ["?movieId", "movie/director", "?directorId"],
      ["?directorId", "person/name", "?directorName"],
    ],
    DB1
  );
  t.deepEqual(result, [
    {
      "?directorId": Examples.ids.jamesCameronID,
      "?directorName": "James Cameron",
      "?movieId": Examples.ids.theTerminatorID,
    },
  ]);
});

// query

test("DumbEngine.query: can query a multi pattern on DB1", (t) => {
  const result = DumbEngine.query(
    {
      find: ["?directorName"],
      where: [
        ["?movieId", "movie/title", "The Terminator"],
        ["?movieId", "movie/director", "?directorId"],
        ["?directorId", "person/name", "?directorName"],
      ],
    },
    DB1
  );
  t.deepEqual(result, [["James Cameron"]]);
});
