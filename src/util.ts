/**
 * Safely access an index of an array.
 * If the accessed index is undefined, throws an error.
 * Satisfies noUncheckedIndexedAccess of tsconfig.
 *
 * @param array - Array to access
 * @param index - Index of Array to access
 * @returns
 */
export function safeArrayAccess<T>(array: T[], index: number): T {
  const access = array[index];

  if (access == null) {
    throw new Error("failed to access index in array");
  }

  return access;
}

export type Range = [
  // inclusive start of range
  start: number,
  // exclusive end of range
  end: number,
];

/**
 * Yields elements of an array from start index to end index.
 * Similar to array.slice, however negative numbers as parameters are not supported yet.
 *
 * @param array - Array to read from
 * @param start - Index to start at (inclusive)
 * @param end - Index to end at (exclusive)
 */
export function* readArray<T>(
  array: T[],
  start: number = 0,
  end: number = array.length,
): Generator<T> {
  if (start < 0) {
    throw new Error("start cannot be negative");
  }

  if (start > Math.max(0, array.length - 1)) {
    throw new Error("start cannot be greater than the indexes in the array");
  }

  if (end > array.length) {
    throw new Error("end cannot be greater than length of the array");
  }

  if (end < start) {
    throw new Error("end cannot be less than start");
  }

  while (start < end) {
    yield safeArrayAccess(array, start);
    start++;
  }
}

export function* ensureSortedSet<T>(
  iterable: Iterable<T>,
  comparator: (a: T, b: T) => number,
): Generator<T> {
  let previous: T | null = null;

  for (const element of iterable) {
    if (previous != null && comparator(element, previous) <= 0) {
      throw new Error("iterable is not a sorted set.");
    }

    yield element;
    previous = element;
  }
}

export async function* ensureSortedSetAsync<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  comparator: (a: T, b: T) => number,
): AsyncGenerator<T> {
  let previous: T | null = null;

  for await (const element of iterable) {
    if (previous != null && comparator(element, previous) <= 0) {
      throw new Error("async-iterable is not a sorted set.");
    }

    yield element;
    previous = element;
  }
}

export type PairwiseElement<A, B> = [A, null] | [null, B] | [A, B];

export type PairwiseDone = [source: boolean, target: boolean];

/**
 * Only returns true if IteratorResult.value is undefined and IteratorResult.done is true
 *
 * @param result - Iterator Result
 * @returns
 */
export const iteratorIsDone = (result: IteratorResult<unknown>): boolean =>
  result.value === undefined && result.done === true;

/**
 * Yields pairwise traversal of two ordered arrays.
 *
 * @param iterableA - First ordered array
 * @param iterableB - Second ordered array
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* pairwiseTraversal<A, B>(
  iterableA: Iterable<A>,
  iterableB: Iterable<B>,
  comparator: (a: A, b: B) => number,
): Generator<[...PairwiseElement<A, B>, ...PairwiseDone]> {
  const iteratorA = iterableA[Symbol.iterator]();
  const iteratorB = iterableB[Symbol.iterator]();

  // initialize a and b values
  let a = iteratorA.next();
  let b = iteratorB.next();

  let aIsDone = iteratorIsDone(a);
  let bIsDone = iteratorIsDone(b);

  while (!aIsDone && !bIsDone) {
    const order = comparator(a.value, b.value);

    const result = [null, null, aIsDone, bIsDone] as [
      ...PairwiseElement<A, B>,
      ...PairwiseDone,
    ];

    if (order <= 0) {
      result[0] = a.value;
      a = iteratorA.next();
    }

    if (order >= 0) {
      result[1] = b.value;
      b = iteratorB.next();
    }

    yield result;

    if (a.done === true) {
      aIsDone = iteratorIsDone(a);
    }
    if (b.done === true) {
      bIsDone = iteratorIsDone(b);
    }
  }

  while (!aIsDone) {
    yield [a.value, null, aIsDone, bIsDone];
    a = iteratorA.next();
    if (a.done === true) {
      aIsDone = iteratorIsDone(a);
    }
  }

  while (!bIsDone) {
    yield [null, b.value, aIsDone, bIsDone];
    b = iteratorB.next();
    if (b.done === true) {
      bIsDone = iteratorIsDone(b);
    }
  }
}
