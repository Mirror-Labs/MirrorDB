/**
 * The types our database supports
 */
export type Type =
  | OrType
  | StringType
  | BooleanType
  | NumberType
  | RefType
  | DateTimeType;

export function equals(t1: Type, t2: Type): boolean {
  if (isOr(t1) && isOr(t2)) {
    return setEquality(typeToSet(t1), typeToSet(t2));
  }

  if (t1.kind === t2.kind) {
    return true;
  }
  return false;
}

function setEquality<A>(as: Set<A>, bs: Set<A>): boolean {
  if (as.size !== bs.size) {
    return false;
  } else {
    for (const a of as) {
      if (!bs.has(a)) {
        return false;
      }
    }
  }
  return true;
}

function typeToSet(type: Type): Set<string> {
  const types = new Set<string>();

  const workList = [type];

  while (workList.length > 0) {
    const item = workList.pop();
    if (item !== undefined) {
      if (isOr(item)) {
        workList.push(item);
        workList.push(item);
      } else {
        types.add(item.kind);
      }
    }
  }

  return types;
}

// Or
type NotOrType = StringType | BooleanType | NumberType | RefType | DateTimeType;

type OrType = {
  readonly kind: "Or";
  readonly type1: Type;
  readonly type2: Type;
};

export function Or(type1: Type, type2: Type): OrType {
  return {
    kind: "Or",
    type1,
    type2,
  };
}

export function isOr(type: Type): type is OrType {
  return type.kind === "Or";
}

// Ref

type RefType = {
  readonly kind: "Ref";
};

export const Ref: RefType = {
  kind: "Ref",
};

export function isRef(type: Type): type is RefType {
  return type.kind === "Ref";
}

// String

type StringType = {
  readonly kind: "String";
};

export const String: StringType = {
  kind: "String",
};

export function isString(type: Type): type is StringType {
  return type.kind === "String";
}

// Boolean

type BooleanType = {
  readonly kind: "Boolean";
};

export const Boolean: BooleanType = {
  kind: "Boolean",
};

export function isBoolean(type: Type): type is BooleanType {
  return type.kind === "Boolean";
}

// Number

type NumberType = {
  readonly kind: "Number";
};

export function isNumber(type: Type): type is NumberType {
  return type.kind === "Number";
}

export const Number: NumberType = {
  kind: "Number",
};

// DateTime

type DateTimeType = {
  readonly kind: "DateTime";
};

export const DateTime: DateTimeType = {
  kind: "DateTime",
};

export function isDateTime(type: Type): type is DateTimeType {
  return type.kind === "DateTime";
}
