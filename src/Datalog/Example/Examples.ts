/**
 * query(id, "movie/year", 1987) :- TrippleStore(id, "movie/year", 1987)
 */
export const query = ["?id", "movie/year", 1987];

/**
 * query1(id) :- TrippleStore(id, "movie/year", 1987)
 */
export const query1 = {
  find: ["?id"],
  where: [["?id", "movie/year", 1987]],
};

/**
 * query2(directorName) :-
 *      TrippleStore(movieId, "movie/title", "The Terminator")
 *      TrippleStore(movieId, "movie/director", directorID)
 *      TrippleStore(directorID, "person/name", directorName)
 */
const query2 = {
  find: ["?directorName"],
  where: [
    ["?movieId", "movie/title", "The Terminator"],
    ["?movieId", "movie/director", "?directorId"],
    ["?directorId", "person/name", "?directorName"],
  ],
};

// Using UUIDs because that is what we will be using in our distributed system.
export const ids = {
  jamesCameronID: "6ed4b259-b17d-49c8-b278-52bcbdf5d985",
  theTerminatorID: "f6214a2a-14b8-4e1b-b834-bb4196ca42d9",
  aliensID: "44cd5c12-bf26-4bf3-99f4-2edec160a8d3",
  theTerminator2ID: "9895d8dc-23f4-4f7e-988a-0a010fe1a418",
  titanicID: "9b68b2e1-211c-47e0-9d5d-6b16d8ef9e9e",
  quentinTarantionID: "c636c4b2-9cd7-4cc1-85fe-3098c2ef9ef8",
  reservoirDogsID: "03b09742-25e8-4e9c-9360-d15532b732fa",
  pulpFictionID: "7d9b0ec5-a29e-418e-86e0-6c044f32ee8c",
  killBillID: "de3cb7f9-1455-441d-a0ac-77933e62d866",
  killBill2ID: "640319aa-244f-4414-9a56-6418ab97b877",
} as const;

function unixTime(time: string): number {
  return new Date(time).getTime();
}

export const DB1: [string, string, string | number][] = [
  [ids.jamesCameronID, "person/name", "James Cameron"],
  [ids.jamesCameronID, "person/born", unixTime("1954-08-16T00:00:00Z")],
  [ids.theTerminatorID, "movie/title", "The Terminator"],
  [ids.theTerminatorID, "movie/director", ids.jamesCameronID],
  [ids.theTerminatorID, "movie/year", unixTime("1984-10-26T00:00:00Z")],
  [ids.aliensID, "movie/title", "Aliens"],
  [ids.aliensID, "movie/director", ids.jamesCameronID],
  [ids.aliensID, "movie/year", unixTime("1986-07-18T00:00:00Z")],
  [ids.theTerminator2ID, "movie/title", "Terminator 2: Judgment Day"],
  [ids.theTerminator2ID, "movie/director", ids.jamesCameronID],
  [ids.theTerminator2ID, "movie/year", unixTime("1991-07-03T00:00:00Z")],
  [ids.titanicID, "movie/title", "Titanic"],
  [ids.titanicID, "movie/director", ids.jamesCameronID],
  [ids.titanicID, "movie/year", unixTime("1997-12-19T00:00:00Z")],

  [ids.quentinTarantionID, "person/name", "Quentin Tarantino"],
  [ids.quentinTarantionID, "person/born", unixTime("1963-03-27T00:00:00Z")],
  [ids.reservoirDogsID, "movie/title", "Reservoir Dogs"],
  [ids.reservoirDogsID, "movie/director", ids.quentinTarantionID],
  [ids.reservoirDogsID, "movie/year", unixTime("1992-01-21T00:00:00Z")],
  [ids.pulpFictionID, "movie/title", "Pulp Fiction"],
  [ids.pulpFictionID, "movie/director", ids.quentinTarantionID],
  [ids.pulpFictionID, "movie/year", unixTime("1994-05-21T00:00:00Z")],
  [ids.killBillID, "movie/title", "Kill Bill"],
  [ids.killBillID, "movie/director", ids.quentinTarantionID],
  [ids.killBillID, "movie/year", unixTime("2003-10-10T00:00:00Z")],
  [ids.killBill2ID, "movie/title", "Kill Bill 2"],
  [ids.killBill2ID, "movie/director", ids.quentinTarantionID],
  [ids.killBill2ID, "movie/year", unixTime("2004-04-08T00:00:00Z")],
];
