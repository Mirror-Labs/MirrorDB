const MDB: any = null;

const commonFields = {
  createdAt: MDB.datetime().auto(),
  updatedAt: MDB.datetime().auto(),
};

const todoEntity = MDB.entity("entity_1", {
  checked: MDB.boolean(),
  description: MDB.string(),
  subTasks: MDB.many(MDB.ref("todo")),
  reminder: MDB.ref("reminder").optional(),
  ...commonFields,
});

// When two databases are merged, the schema is merged as well.
todoEntity.join(MDB.entity("entity_1", { checked: MDB.boolean() }));

const reminderEntity = MDB.entity("entity_2", {
  time: MDB.datetime(),
  ...commonFields,
});

const schema = MDB.schema([todoEntity, reminderEntity]);

/**
 * The generated schema looks like this:
 *
 * todo
 *  ref -[__id__]-> string
 *  ref -[__kind__]-> "entity_1" // This values can never be allowed to change, and should be set to some long random string.
 *  ref -[checked]-> boolean
 *  ref -[description]-> string
 *  ref -[subTasks]-> ref[]
 *  ref -[reminder]-> ref | undefined
 *  ref -[createdAt]-> Date
 *  ref -[updatedAt]-> Date
 *
 * reminder
 *  ref -[__id__]-> string
 *  ref -[__kind__]-> "entity_2" // This values can never be allowed to change, and should be set to some long random string.
 *  ref -[time]-> Date[]
 *  ref -[createdAt]-> Date
 *  ref -[updatedAt]-> Date
 *
 */

/**
 * Merging strategies:
 *
 * 1. last write wins
 * 2. first write wins
 * 3. merge
 *
 * If our database is monotonic (i.e. we never delete anything), then we can use
 * then we never have rollbacks.
 *
 *
 * Notes
 * - When two databases are merged, their schemas are merged as well.
 * - Their should be a way to select a subset of a database to merge.
 * - All queries should return "new databases" we will go with the mental model
 *   that the database is immutable, and is just a value as anything else.
 * - If you have a ref to the database, and some data, then you will receive a new
 *   database with the data added. If you query the old database, you will not see the
 *   new data. If you query the new database, you will see the new data.
 *
 */

/**
 * Creating a database
 *
 * Storage Engines:
 * - InMemoryStorageEngine
 *   - This is a reference implmentation, and should be used for testing. Works in the browser and node.
 * - IndexedDBStorageEngine
 *  - This is a storage engine that uses the browser's IndexedDB. Only works in the browser.
 * - FileStorageEngine
 *  - This is a storage engine that uses the file system. Only works in node.
 *
 */

const storageEngine = new MDB.InMemoryStorageEngine();

// new MDB.IndexedDBStorageEngine();
// new MDB.FileStorageEngine();

const db1 = MDB.createDB(schema, storageEngine);

/**
 * You can also create connect to remote databases.
 *
 * Here we enfore that the schema is the same as the local one.
 */
const db2 = MDB.connectToDB(
  schema,
  new MDB.HTTPChannel("http://localhost:8080"),
  MDB.SymmetricAuth("secret")
);

/**
 * Here we allow any schema.
 */
const db3 = MDB.connectToDB(
  MDB.AnySchema,
  new MDB.HTTPChannel("http://localhost:8080"),
  MDB.noAuth()
);

/**
 * Channels are a way to create remote connections to databases.
 * There are multiple types of channels, each channel uses a different underlying protocol:
 * - new BluetoothChannel()
 * - new DBUSChannel()
 * - new USBChannel()
 * - new WebRTCChannel("id")
 * - new WebSocketChannel("MyCustomDomain.com", 9099)
 * - new HTTPChannel("MyCustomDomain.com", 9099)
 * - new TCPChannel("192.158.1.38", 8080)
 * - new UDPChannel("localhost.com", 8080)
 * - new FileChannel("path/to/file")
 *
 * Remote databases are their own nodes. They may or may not allow you to write/read to them. They can
 * impose any restrictions they want.
 */

/**
 * But we also want to be able to dynamically find databases in our environment. This will let us sync devices
 * and find other users.
 *
 * There are different ways of discovering other databases:
 * - new BluetoothDiscovery()
 * - new LocalDiscovery()
 * - new DBUSDiscovery()
 * - new ICEDiscovery() // TURN and STUN servers
 *
 *
 */

const bluetoothDiscovery = new MDB.BluetoothDiscovery();

const unRegister = bluetoothDiscovery.on("found", (channel: any) => {});

/**
 * Merging
 * - Merge two databases together.
 * - Can either be done once, or can be done continuously.
 * - If a merge fails, then the databases are not merged.
 * - Can either be duplex or simplex.
 *
 */
db1.mergeOnceDuplex(db2);
db1.mergeOnceSimplex(db2);
db1.mergeStreamDuplex(db2);
db1.mergeStreamSimplex(db2);

/**
 * Querying
 */

// Querying is done using a query DSL. It is a pretty wrapper around the underlying query language, datalog.
// The query DSL is a subset of datalog, and is designed to be easy to use and map to developers mental model.
