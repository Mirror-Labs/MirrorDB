import { Result } from "ts-results";

/**
 * A dumb storage layer. It will not perform any validation what so ever.
 */
export interface IStoreEvents {
  join(...event: Array<Event>): Result<undefined, IStoreEvents.Error>;

  find(id: UUID): Event | undefined;

  findAll(): Array<Event>;
}

export namespace IStoreEvents {
  export enum Error {
    OverlappingUUID,
    RefrencedUUIDDoesNotExist,
  }
}

/**
 * How do I join?
 *  - Node
 *  - Schema
 *  - Entry
 * 2. Calculate what can be joined between their subset and my subset (I always use my full set!)
 *  - Are all nodes available?
 *  - Are all schemas available?
 *  - Are there any overlapping UUIDs?
 *
 * 3. Perform the join! (make sure that we can recover on failure/halting etc)
 * 4. Derive the new View
 * 5. Update indexes
 * 6. Notify all queries
 *
 *
 * Questions:
 * - How do we comunicate between two nodes about their diffs without transfering the objects?
 * - What is the best way of storing it?
 *  - Our structure is a tree.
 *  - Events that refrence each other should be close to one another.
 * - How do users refrence one entity to another and make sure we either sync both or none?
 * - How do we query?
 * - How do we deal with forign keys? Do we even suport it?
 *
 *
 * MVP:
 * - Store TODO list items
 * - Sync between apps
 * - Persist between sessions
 * - Sync between browser windows
 * - Reactive Queries
 *
 *
 * Features:
 * - Realtime replication
 * - Async replication
 * - File sync
 * - WebRTC sync
 * - Bluetooth sync
 * - USB sync
 * - Sync over LAN
 * - Multi-tab Support
 * - Encryption
 * - Compression
 * - Live queries
 */

export interface IHaveView {}

////////////////////////////////////////////////////////////////////////////////
// Events
////////////////////////////////////////////////////////////////////////////////

export type Event = {
  version: Version;
  id: UUID;
  by: UUID;
  timestamp: HLCTimestamp;
  body: Body;
};

export enum EventType {
  SCHEMA,
  CREATE,
  UPDATE,
  DELETE,
  NODE,
}

export type Body = CreateSchema | CreateEntry | UpdateEntry | Delete | Node;

export type CreateSchema = {
  type: EventType.SCHEMA;
  // schema: JSONSchema;
};

export type CreateEntry = {
  type: EventType.CREATE;
  ref: UUID; // Needs to refrence a valid schema event
  data: JSON;
};

export type UpdateEntry = {
  type: EventType.UPDATE;
  ref: UUID; // Needs to refrence a valid create event
  data: JSON; // The result after update must adhere to the schema
};

type JSONSchema = string; //TODO: replace this type
type JSON = string; // TODO: replace this type

/**
 * Delete an entry with a given UUID in the database.
 *
 * A delete event will make us ignore at later update events.
 */
export type Delete = {
  type: EventType.DELETE;
  ref: UUID;
};

export type Node = {
  name: string;
  pubkey: string; // Used to establish trusted nodes to link with
};

type Version = 1;

/**
 * Each event has a UUID
 */
export type UUID = string;

/**
 * Used to order events.
 *
 * [0]: the datetime
 * [1]: the tick
 */
export type HLCTimestamp = [Date, number];
