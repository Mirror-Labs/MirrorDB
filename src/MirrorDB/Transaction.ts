import { Attribute, TrippleFact } from "src/Datalog/Types"

interface Transaction {
  add(entity: string, addOp: AddOp): TempRef;
  update(entity: string, updateOp: UpdateOp): TempRef;
}

class TransactionImpl implements Transaction {
  private _operations: Operation[];
  private _tempRefs: Set<TempRef>;

  constructor() {
    this._operations = [];
    this._tempRefs = new Set();
  }

  get operations(): Operation[] {
    return this._operations;
  }

  get tempRefs(): Set<TempRef> {
    return this._tempRefs;
  }

  public add(entity: string, addOp: AddOp): TempRef {
    return { kind: 'TempRef', ref: ''};
  }

  public update(entity: string, updateOp: UpdateOp): TempRef {
    return { kind: 'TempRef', ref: ''};
  }
}

type DB = TrippleFact[];

type TempRef = {
  kind: 'TempRef';
  ref: string;
};

type Ref = string;

type Operation = AddOp | UpdateOp;

type MirrorDBValue = string | number | boolean;

type AddOp = {
  kind: 'AddOp';

  tempRef: string;
  entity: string;
  values: Map<string, MirrorDBValue | TempRef | undefined>;
}

type UpdateOp = {
  kind: 'UpdateOp';
  entity: string;
  find: [string, MirrorDBValue | Ref];
  values: Map<string, MirrorDBValue | TempRef | undefined>;
};

export function transact(f: (tx: Transaction) => void, db: DB, genRef: () => string): DB {
  const tx = new TransactionImpl();

  f(tx);

  const mapRefs: Map<string, Ref> = new Map();

  const newTripples: [Ref, Attribute, MirrorDBValue | TempRef][] = [];
  const toRemove: [any, any][] = [];
  for (const op of tx.operations) {
    if (op.kind === 'AddOp') {
      const ref = genRef();
      mapRefs.set(op.tempRef, ref);
      const namespace = op.entity;
      for (const entry of op.values) {
        const attr = entry[0];
        const value = entry[1];
        const fullAttr = `:${namespace}/${attr}`;
        if (value !== undefined) {
          newTripples.push([ref, fullAttr, value]);
        }
      }
    } else if (op.kind === 'UpdateOp') {
      const findAttr = op.find[0];
      const findValue = op.find[1];
      let oldFact;
      for (const fact of db) {
        if (fact.attribute === findAttr && fact.value === findValue) {
          oldFact = fact;
        }
      }

      if (oldFact) {
        const ref = oldFact.entity;
        const namespace = op.entity;
        for (const entry of op.values) {
          const attr = entry[0];
          const value = entry[1];
          const fullAttr = `:${namespace}/${attr}`;
          if (value !== undefined) {
            newTripples.push([ref, fullAttr, value]);
            toRemove.push([ref, fullAttr]);
          }
        }
      }
    }
  }

  for (const newFact of newTripples) {
    const value = newFact[2];
    if (typeof(value) === 'object' && value.kind === 'TempRef') {
      const tempRef = newFact[2] as TempRef;
      newFact[2] = mapRefs.get(tempRef.ref)!;
    }
  }

  const newDb = db.filter((fact) =>
    toRemove
      .filter((removeFact) =>
        removeFact[0] === fact.entity && removeFact[1] === fact.attribute)
      .length === 0);
 
  for (const newFact of newTripples) {
    newDb.push(new TrippleFact(newFact[0], newFact[1], newFact[2] as MirrorDBValue | Ref));
  }

  return newDb;
}
