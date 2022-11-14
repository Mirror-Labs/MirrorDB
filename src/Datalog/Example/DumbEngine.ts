// https://www.instantdb.com/essays/datalogjs

export type Pattern = [string, string, string | number];
export type Tripple = [string, string, string | number];
export type Context = Record<string, number | string>;

/**
 *
 * @param pattern - the pattern we are looking for
 * @param triple - the tripple we are tyring to match against
 * @param context - the current context
 * @returns a Context on match, and undefined if there wasn't a match.
 */
export function matchPattern(
  pattern: Pattern,
  triple: Tripple,
  context: Context
) {
  return pattern.reduce((context, patternPart, idx) => {
    const triplePart = triple[idx];
    return matchPart(patternPart, triplePart, context);
  }, context as Context | undefined);
}

/**
 * Helper function to match on individual parts of a tripple/pattern
 */
function matchPart(
  patternPart: string | number,
  triplePart: string | number,
  context?: Context
): Context | undefined {
  if (!context) return undefined;
  if (isVariable(patternPart)) {
    return matchVariable(patternPart, triplePart, context);
  }
  return patternPart === triplePart ? context : undefined;
}

/**
 * A variable is a string that starts with a '?'-mark
 */
export type Variable = `?${string}`; //very nice

/**
 * Check if a value is a variable.
 *
 * A variable is a string that starts with a question mark
 *
 * @example '?id' or '?name', 'id' without a '?' would not be a variable
 *
 * @param x - the value
 * @returns true if it is a variable, false if it is not a variable
 */
function isVariable(x: any): x is Variable {
  return typeof x === "string" && x.startsWith("?");
}

/**
 *
 * @param variable - the variable
 * @param triplePart - the tripple part we are mathcing against
 * @param context - the current context
 * @returns returns a context on success, and undefined if it wasn't successfull
 */
function matchVariable(
  variable: Variable,
  triplePart: number | string,
  context: Context
): Context | undefined {
  if (context.hasOwnProperty(variable)) {
    const bound = context[variable];
    return matchPart(bound, triplePart, context);
  }
  return { ...context, [variable]: triplePart }; // immutability is very important...
}

/**
 *
 * @param pattern - the pattern to look for
 * @param db - the database of facts
 * @param context - the current context
 * @returns a list of contexts, empty if the query couldn't be fullfilled.
 */
export function querySingle(
  pattern: Pattern,
  db: DB,
  context: Context
): Context[] {
  return relevantTriples(pattern, db)
    .map((triple) => matchPattern(pattern, triple, context))
    .filter((x) => x) as Context[];
}

function relevantTriples(pattern: Pattern, db: DB) {
  const [id, attribute, value] = pattern;
  if (!isVariable(id)) {
    return db.entityIndex[id];
  }
  if (!isVariable(attribute)) {
    return db.attrIndex[attribute];
  }
  if (!isVariable(value)) {
    return db.valueIndex[value];
  }
  return db.triples;
}

/**
 *
 * @param patterns - the patterns to look for
 * @param db - the database of facts
 * @returns a list of contexts, empty if the query couldn't be fullfilled.
 */
export function queryWhere(patterns: Pattern[], db: DB) {
  return patterns.reduce(
    (contexts, pattern) => {
      return contexts.flatMap((context) => querySingle(pattern, db, context));
    },
    [{}] as Context[]
  );
}

type Query = { find: string[]; where: Pattern[] };

/**
 *
 * @param query - the query to execute on the database
 * @param db - the tripple store
 * @returns
 */
export function query({ find, where }: Query, db: DB) {
  const contexts = queryWhere(where, db);
  return contexts.map((context) => actualize(context, find));
}

function actualize(context: Context, find: string[]): (string | number)[] {
  return find.map((findPart) => {
    return isVariable(findPart) ? context[findPart] : findPart;
  });
}

/**
 * Note: You can index much more aggressivly.
 * A Tripple is Entity, Attribute, Value => EAV
 * So you stack the lookups inside one another.
 * first you lookup the enitity, then you can lookup any attribute.
 *
 * You then do this for all usefull combinations: AEV, VEA, and etc
 *
 */
type DB = {
  triples: Tripple[];
  entityIndex: Record<string, Tripple[]>;
  attrIndex: Record<string, Tripple[]>;
  valueIndex: Record<number | string, Tripple[]>;
};

export function createDB(triples: Tripple[]): DB {
  return {
    triples,
    entityIndex: indexBy(triples, 0),
    attrIndex: indexBy(triples, 1),
    valueIndex: indexBy(triples, 2),
  };
}

function indexBy(
  triples: Tripple[],
  idx: 0 | 1 | 2
): Record<string | number, Tripple[]> {
  return triples.reduce((index, triple) => {
    const k = triple[idx];
    index[k] = index[k] || [];
    index[k].push(triple);
    return index;
  }, {} as Record<string | number, Tripple[]>);
}
