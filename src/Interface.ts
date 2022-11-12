export interface ICanCompare<A> {
  /**
   * Compare two objects.
   *
   * @param other - the other instance you will be compared to
   * @return a negative number if left is smaller, 0 for equal, and a positive number if left is larger
   */
  compareTo(other: A): number;
}

export namespace ICanCompare {
  /**
   * if `fst` is greater then `snd`
   */
  export function greaterThen<A extends ICanCompare<A>>(
    fst: A,
    snd: A
  ): boolean {
    return fst.compareTo(snd) > 0;
  }

  // TODO: Add more utility functions as needed...
}

export interface ICanMax<A> {
  /**
   * Return the larger object
   *
   * @param other - the other instance you will be compared to
   * @return the larger object
   */
  max(other: A): A;
}

export namespace ICanMax {
  /**
   * Take the maximum of a series of values
   *
   * @param value - the value to take the maximum of
   * @param values - the rest of the values to take the maximum of
   * @returns the maximal value
   */
  export function max<A extends ICanMax<A>>(value: A, ...values: Array<A>): A {
    let max = value;
    values.forEach((value) => {
      max = max.max(value);
    });
    return max;
  }
}

export interface ICanEqual<A> {
  /**
   * check if two objects are equal
   *
   * @param other - the other instance you will be compared to
   * @return true if they are equal, and false otherwise
   */
  equals(other: A): boolean;
}
