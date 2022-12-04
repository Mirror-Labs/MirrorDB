import * as Type from "./Type";
import { Cardinality, join } from "./Cardinality";

/**
 * The schema for a single tripple
 */
export class TrippleType {
  constructor(
    private _type: Type.Type,
    private _cardinality: Cardinality,
    private _unique: boolean
  ) {}

  get type(): Type.Type {
    return this._type;
  }

  get cardinality(): Cardinality {
    return this._cardinality;
  }

  get unique(): boolean {
    return this._unique;
  }

  join(other: TrippleType): TrippleType {
    return new TrippleType(
      Type.Or(this.type, other.type),
      join(this.cardinality, other.cardinality),
      this.unique && other.unique // Both must be unique to stay unqiue
    );
  }

  equals(other: TrippleType): boolean {
    return (
      this.unique === other.unique &&
      this.cardinality === other.cardinality &&
      Type.equals(this.type, other.type)
    );
  }
}
