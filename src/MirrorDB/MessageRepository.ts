// import { Result } from "ts-results";
// import { IStoreEvents, UUID, Event } from "./Types";

// enum DBOpenState {
//   OK,
//   NEED_UPGRADE,
// }

// const IndexMetadata = {
//   version: { name: "version", key: "version" },
//   by: { name: "by", key: "by" },
//   timestamp: { name: "timestamp", key: "timestamp" },
//   type: { name: "type", key: ["body", "type"] },
// } as const;

// export class MessageRepository implements IStoreEvents {
//   constructor(private db: IDBDatabase) {}

//   static async init(
//     dbName: string,
//     version: number
//   ): Promise<[MessageRepository, DBOpenState, globalThis.Event]> {
//     const openRequest = window.indexedDB.open(dbName, version);
//     return new Promise((resolve, reject) => {
//       openRequest.onsuccess = (event) =>
//         resolve([
//           new MessageRepository(openRequest.result),
//           DBOpenState.OK,
//           event,
//         ]);
//       openRequest.onupgradeneeded = (event) => {
//         const db = openRequest.result;

//         // Create Indexes
//         this.createIndexes(db);

//         resolve([
//           new MessageRepository(openRequest.result),
//           DBOpenState.NEED_UPGRADE,
//           event,
//         ]);
//       };
//       openRequest.onerror = (event) => reject(openRequest.error);
//     });
//   }

//   private static createIndexes(db: IDBDatabase) {
//     const eventStore = db.createObjectStore("Events", { keyPath: "id" });
//     db.createObjectStore;
//     eventStore.createIndex(
//       IndexMetadata.version.name,
//       IndexMetadata.version.key,
//       { unique: false }
//     );
//     eventStore.createIndex(IndexMetadata.by.name, IndexMetadata.by.key, {
//       unique: false,
//     });
//     eventStore.createIndex(
//       IndexMetadata.timestamp.name,
//       IndexMetadata.timestamp.key,
//       { unique: false }
//     );
//     eventStore.createIndex(IndexMetadata.type.name, IndexMetadata.type.key, {
//       unique: false,
//     });
//   }

//   join(...event: Array<Event>): Result<undefined, IStoreEvents.Error> {
//     throw Error("Not Implemented");
//   }

//   find(id: UUID): Event | undefined {
//     throw Error("Not Implemented");
//   }

//   findAll(): Array<Event> {
//     throw Error("Not Implemented");
//   }
// }
