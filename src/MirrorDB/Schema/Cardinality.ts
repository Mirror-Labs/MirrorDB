/**
 * The number of values that can be associated with a attribute.
 *
 * It formes a Partially ordered Set, also known as a lattice.
 *
 * It has the following dimond shape:
 *
 *        ZeroOrMore
 *      ______|_____
 *     /            \
 * ZeroOrOne      OneOrMore
 *      \____________/
 *            |
 *           One
 *
 * `One` is the smallest value, and `ZeroOrMore` is the largest value
 */
export enum Cardinality {
  One = "One",
  ZeroOrOne = "ZeroOrOne",
  OneOrMore = "OneOrMore",
  ZeroOrMore = "ZeroOrMore",
}

/**
 * Find the least upper bound between two Cardinalities
 *
 * @param a - first `Cardinality`
 * @param b - second `Cardinality`
 * @returns the least upper bound
 */
export function join(a: Cardinality, b: Cardinality): Cardinality {
  if (a === Cardinality.One) {
    return b;
  }

  if (a === Cardinality.OneOrMore) {
    if (b === Cardinality.One || b === Cardinality.OneOrMore) {
      return Cardinality.OneOrMore;
    } else {
      return Cardinality.ZeroOrMore;
    }
  }

  if (a === Cardinality.ZeroOrOne) {
    if (b === Cardinality.One || b === Cardinality.ZeroOrOne) {
      return Cardinality.ZeroOrOne;
    } else {
      return Cardinality.ZeroOrMore;
    }
  }
  return Cardinality.ZeroOrMore;
}

/**
 * Find the greatest lower bound between two Cardinalities
 *
 * @param a - first `Cardinality`
 * @param b - second `Cardinality`
 * @returns the greatest lower bound
 */
export function meet(a: Cardinality, b: Cardinality): Cardinality {
  if (a === Cardinality.ZeroOrMore) {
    return b;
  }

  if (a === Cardinality.OneOrMore) {
    if (b === Cardinality.ZeroOrMore || b === Cardinality.OneOrMore) {
      return Cardinality.OneOrMore;
    } else {
      return Cardinality.One;
    }
  }

  if (a === Cardinality.ZeroOrOne) {
    if (b === Cardinality.ZeroOrMore || b === Cardinality.ZeroOrOne) {
      return Cardinality.ZeroOrOne;
    } else {
      return Cardinality.One;
    }
  }

  return Cardinality.One;
}
