import * as Interface from "src/Interface";

// guide: https://tonsky.me/blog/datascript-internals/
// tips & tricks: https://tonsky.me/blog/datascript-2/

export type EntityID = string;
export type Attribute = string;
export type Value = string | number | boolean;

export type TripleRaw = [string, string, string | number];

////////////////////////////////////////////////////////////////////////////////
// Fact
////////////////////////////////////////////////////////////////////////////////

interface _Fact {
  isTripple(): this is TrippleFact;
  isDerived(): this is DerivedFact;
}

export type Fact = _Fact & Interface.ICanEqual<Fact>;

export class TrippleFact implements Fact {
  constructor(
    private _entity: EntityID,
    private _attribute: Attribute,
    private _value: Value
  ) {}

  // Should only use entity, attribute, and value
  hash(): string {
    return this.entity + "." + this.attribute + "." + this.value;
  }

  get entity() {
    return this._entity;
  }

  get attribute() {
    return this._attribute;
  }

  get value() {
    return this._value;
  }

  update(obj: { entity?: EntityID; attribute?: Attribute; value?: Value }) {
    return new TrippleFact(
      obj.entity ?? this.entity,
      obj.attribute ?? this.attribute,
      obj.value ?? this.value
    );
  }

  isTripple(): this is TrippleFact {
    return true;
  }
  isDerived(): this is DerivedFact {
    return false;
  }
  equals(other: Fact): boolean {
    return (
      other.isTripple() &&
      this.entity === other.entity &&
      this.attribute === other.attribute &&
      this.value === other.value
    );
  }
}

export class DerivedFact implements Fact {
  constructor(private _name: string, private _expr: Expr[]) {}

  get name() {
    return this._name;
  }

  get expr() {
    return this._expr;
  }

  isTripple(): this is TrippleFact {
    return false;
  }
  isDerived(): this is DerivedFact {
    return true;
  }
  equals(other: Fact): boolean {
    return (
      other.isDerived() &&
      this.name === other.name &&
      arrayEquals((s1, s2) => s1.equals(s2), this.expr, other.expr)
    );
  }
}

////////////////////////////////////////////////////////////////////////////////
// Rule
////////////////////////////////////////////////////////////////////////////////

export class Rule implements Interface.ICanEqual<Rule> {
  constructor(
    private _name: string,
    private _vars: string[],
    private _clauses: Clause[]
  ) {}

  equals(other: Rule): boolean {
    return (
      this.name === other.name &&
      arrayEquals((s1, s2) => s1 === s2, this.vars, other.vars) &&
      arrayEquals((s1, s2) => s1.equals(s2), this.clauses, other.clauses)
    );
  }

  get name(): string {
    return this.name;
  }

  get vars(): string[] {
    return this._vars;
  }

  get clauses(): Clause[] {
    return this._clauses;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Clause
////////////////////////////////////////////////////////////////////////////////

interface _Clause {
  isTripplePattern(): this is TripplePatternClause;
  isDerivedPattern(): this is DerivedPatternClause;
}

export type Clause = _Clause & Interface.ICanEqual<Clause>;

export class TripplePatternClause implements Clause {
  constructor(
    private _entity: Expr,
    private _attr: Expr,
    private _value: Expr
  ) {}

  get entity(): Expr {
    return this._entity;
  }

  get attr(): Expr {
    return this._attr;
  }

  get value(): Expr {
    return this._value;
  }

  equals(other: Clause): boolean {
    return (
      other.isTripplePattern() &&
      this.entity.equals(other.entity) &&
      this.attr.equals(other.attr) &&
      this.value.equals(other.value)
    );
  }

  isTripplePattern(): this is TripplePatternClause {
    return true;
  }
  isDerivedPattern(): this is DerivedPatternClause {
    return false;
  }
}

export class DerivedPatternClause implements Clause {
  constructor(private _name: string, private _expr: Expr[]) {}

  get name(): string {
    return this._name;
  }

  get expr(): Expr[] {
    return this._expr;
  }

  equals(other: Clause): boolean {
    return (
      other.isDerivedPattern() &&
      this.name === other.name &&
      arrayEquals((a, b) => a.equals(b), this.expr, other.expr)
    );
  }

  isTripplePattern(): this is TripplePatternClause {
    return false;
  }
  isDerivedPattern(): this is DerivedPatternClause {
    return true;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Expr
////////////////////////////////////////////////////////////////////////////////

interface _Expr {
  isVal(): this is ExprVal;
  isVar(): this is ExprVar;
}

export type Expr = _Expr & Interface.ICanEqual<Expr>;

export class ExprVal implements Expr {
  constructor(private _value: string | number) {}

  get value() {
    return this._value;
  }

  equals(other: Expr): boolean {
    return other.isVal() && this.value === other.value;
  }

  isVal() {
    return true;
  }
  isVar() {
    return false;
  }
}

export class ExprVar implements Expr {
  constructor(private _var: string) {}

  get var() {
    return this._var;
  }

  equals(other: Expr): boolean {
    return other.isVar() && this.var === other.var;
  }

  isVal() {
    return false;
  }
  isVar() {
    return true;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////

function arrayEquals<A, B>(
  eq: (a: A, b: B) => boolean,
  a: Array<A>,
  b: Array<B>
) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => eq(val, b[index]))
  );
}

// class DB {
//   //book keeping
//   private schema: Map<string, any> = new Map();
//   private rschema: Map<string, any> = new Map();
//   private maxEID: number = 0;
//   private maxTX: number = 0;

//   // indexes
//   private eavt: BTSet = new BTSet();
//   private aevt: BTSet = new BTSet();
//   private avet: BTSet = new BTSet();

//   //add
//   //retract
//   //search (search for a range of datums)
// }

// // Adding data
// // entity map → op vector[s] → id resolution → datom[s]

// // dbBefore + txData = dbAfter
// type TxReport = {
//   dbBefore: DB;
//   dbAfter: DB;
//   txData: Datum[];
//   tempIDs: Map<number, any>; //id -> entity
//   txMeta: any; //no idea what this contains
// };

// // It’s an immutable, persistent implementation of B+ tree data structure.
// // continuous js arrays as tree nodes
// class BTSet {}

// //Entity

// /// Entity is just a convenient interface to EAVT
// // make it look like a normal map
