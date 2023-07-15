import * as Types from "../Types.js";
import {
  Attribute,
  EntityID,
  Fact,
  TripplePatternClause,
  Value,
  Variable,
} from "../Types.js";

export type Query = {
  find: string[];
  where: Clause[];
};

type Clause = [Expr, Attribute, Expr];

type Expr = EntityID | Value | Variable;

function compileClause(clause: Clause): Types.Clause {
  return new TripplePatternClause(
    compileExpr(clause[0]),
    clause[1],
    compileExpr(clause[2])
  );
}

function compileExpr(expr: Expr): Types.Expr {
  if (typeof expr in ["number", "boolean"]) {
    return new Types.ExprVal(expr);
  }
  if (typeof expr === "string") {
    return expr.charAt(0) === "?"
      ? new Types.ExprVar(expr)
      : new Types.ExprVal(expr);
  }

  throw Error("Unhandled type in compileExpr");
}

// https://github.com/funrep/datlite/blob/main/src/Query/SemiNaive.hs
export function exec(facts: Types.TrippleFact[], query: Query) {
  const result: Map<string, Value>[] = generateBindings(
    facts,
    query.where.map(compileClause)
  );

  return result.map((m) => {
    const newM = new Map<string, Value>();
    for (const key of query.find) {
      const res = m.get(key);
      if (res) {
        newM.set(key, res);
      }
    }
    return newM;
  });
}

function generateBindings(
  facts: Fact[],
  clauses: Types.Clause[]
): Map<string, Value>[] {
  const goals = clauses.map((c) => evalClause(facts, c));
  return goals.slice(1).reduce(unifyBindingsArrays, goals[0]);
}

function unifyBindingsArrays(
  prev: Map<string, Value>[],
  curr: Map<string, Value>[]
): Map<string, Value>[] {
  const unifiedLists = prev.map(
    (prevBindings) =>
      curr
        .map((currBindings) => unifyBindings(prevBindings, currBindings))
        .filter((bindings) => bindings !== undefined) as Map<string, Value>[]
  );
  let result: Map<string, Value>[] = [];
  for (const list of unifiedLists) {
    result = result.concat(list);
  }
  return result;
}

function unifyBindings(
  bindings1: Map<string, Value>,
  bindings2: Map<string, Value>
): Map<string, Value> | undefined {
  const joined1 = union(bindings1, bindings2);
  const joined2 = union(bindings2, bindings1);
  if (mapEquals(joined1, joined2)) {
    return joined1;
  } else {
    return undefined;
  }
}

function mapEquals(map1: Map<string, Value>, map2: Map<string, Value>) {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const entry in map1) {
    if (!(entry[0] in map2 && entry[1] === map2.get(entry[0]))) {
      return false;
    }
  }
  return true;
}

function union(
  bindings1: Map<string, Value>,
  bindings2: Map<string, Value>
): Map<string, Value> {
  const newBindings = new Map(bindings1);
  for (const entry of bindings2) {
    if (!(entry[0] in bindings1)) {
      newBindings.set(entry[0], entry[1]);
    }
  }
  return newBindings;
}

function evalClause(facts: Fact[], clause: Types.Clause): Map<string, Value>[] {
  return facts
    .map((f) => unify(clause, f))
    .filter((result) => result !== undefined) as Map<string, Value>[];
}

function unify(
  clause: Types.Clause,
  fact: Fact
): Map<string, Value> | undefined {
  if (clause.isTripplePattern() && fact.isTripple()) {
    const result = new Map();
    if (clause.attr !== fact.attribute) {
      return undefined;
    }
    if (clause.entity.isVal() && clause.entity.value !== fact.entity) {
      return undefined;
    }
    if (clause.entity.isVar()) {
      result.set(clause.entity.var, fact.entity);
    }
    if (clause.value.isVal() && clause.value.value !== fact.value) {
      return undefined;
    }
    if (clause.value.isVar()) {
      result.set(clause.value.var, fact.value);
    }
    return result;
  }
  throw Error("Unhandeled clause in unify");
}
