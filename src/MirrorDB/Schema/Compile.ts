import * as Builder from "./Builder";

export type Schema<A extends string> = Record<A, EntitySchema>;

export class EntitySchema {
  constructor(
    private _name: string,
    private _tripplesSchemas: Map<string, TrippleSchema>
  ) {}

  get name(): string {
    return this._name;
  }

  find(key: string): TrippleSchema | undefined {
    return this._tripplesSchemas.get(key);
  }
}

export class TrippleSchema {
  match(value: any): boolean {
    return true;
  }
}

export function schema(
  builder: Record<string, Record<string, Builder.SchemaValue>>
): Schema<string> {
  return {};
}
