import { Transaction } from "./Transaction";

type MirrorQuery = {
  find: object;
  sortBy?: object;
  limit?: number;
  offset?: number;
};

export type Schema = Record<string, EntitySchema>;

export type EntitySchema = Record<string, MirrorType>;

export type MirrorType = MMany | MirrorNonRecursiveType;

type MirrorNonRecursiveType =
  | MBoolean
  | MString
  | MEntity
  | MDatetime
  | MId
  | MIdAuto;

type MBoolean = {
  kind: "MBoolean";
};

type MString = {
  kind: "MString";
};

type MEntity = {
  kind: "MEntity";
  ref: string;
};

type MMany = {
  kind: "MMany";
  type: MirrorType;
};

type MDatetime = {
  kind: "MDatetime";
};

type MId = {
  kind: "MId";
};

type MIdAuto = {
  kind: "MIdAuto";
};

export class MirrorDB {
  public static boolean: MBoolean = { kind: "MBoolean" };
  public static string: MString = { kind: "MString" };
  public static entity: (ref: string) => MEntity = (ref: string) => {
    return { kind: "MEntity", ref };
  };
  public static many: (type: MirrorNonRecursiveType) => MMany = (
    type: MirrorNonRecursiveType
  ) => {
    return { kind: "MMany", type };
  };
  public static datetime: MDatetime = { kind: "MDatetime" };
  public static id: MId = { kind: "MId" };

  constructor(_url: string, schema: Schema) {}

  public query<T>(query: MirrorQuery): T[] {
    return [];
  }
  public transact(f: (transaction: Transaction) => void): boolean {
    return true;
  }
}
