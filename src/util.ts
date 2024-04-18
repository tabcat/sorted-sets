/**
 * Access an index of an array. If the accessed index is undefined, throw.
 * Satisfies noUncheckedIndexedAccess of tsconfig.
 *
 * @param array
 * @param index
 * @returns
 */
export function safeArrayAccess<T>(array: T[], index: number): T {
  const access = array[index];

  if (access == null) {
    throw new Error("failed to access index in array");
  }

  return access;
}

/*
 * Yields array indexes and element comparison by traversing two arrays in order.
 *
 * @param first - First array to traverse
 * @param second - Second array to traverse
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* dualTraversal<T>(
  first: T[],
  second: T[],
  comparator: (a: T, b: T) => number,
): Generator<[number, number, number]> {
  // can handle empty sets as parameters
  let i = -1,
    j = -1;
  if (first.length > 0) i = 0;
  if (second.length > 0) j = 0;

  // safe i, safe j
  const getSafeI = () => Math.min(first.length - 1, i);
  const getSafeJ = () => Math.min(second.length - 1, j);

  while (i >= 0 && i < first.length && j >= 0 && j < second.length) {
    const safeI = getSafeI();
    const safeJ = getSafeJ();
    const order = comparator(
      safeArrayAccess(first, safeI),
      safeArrayAccess(second, safeJ),
    );

    yield [safeI, safeJ, order];

    if (order < 0) {
      // first element < second element
      // increment first
      i++;

      // if i was last index, also increment j
      if (i === first.length) {
        j++;
      }
    } else if (order > 0) {
      // first element > second element
      // increment second
      j++;

      // if j was last index, also increment i
      if (j === second.length) {
        i++;
      }
    } else {
      // first element = second element
      // first is in second set, don't add to difference
      i++;
      j++;
    }
  }

  while (i >= 0 && i < first.length) {
    const safeI = getSafeI();
    const safeJ = getSafeJ();

    // only second set is empty
    if (j === -1) {
      yield [safeI, j, -1]; // -1 because first[safeI] (comparator a param) is < undefined
    } else {
      yield [
        safeI,
        safeJ,
        comparator(
          safeArrayAccess(first, safeI),
          safeArrayAccess(second, safeJ),
        ),
      ];
    }

    i++;
  }

  while (j >= 0 && j < second.length) {
    const safeI = getSafeI();
    const safeJ = getSafeJ();

    // only first set is empty
    if (i === -1) {
      yield [i, safeJ, 1]; // 1 because second[safeJ] (comparator b param) is < undefined
    } else {
      yield [
        safeI,
        safeJ,
        comparator(
          safeArrayAccess(first, safeI),
          safeArrayAccess(second, safeJ),
        ),
      ];
    }

    j++;
  }
}

/**
 * Similar to .splice except it does not create a new array.
 * Also negative numbers as parameters is not supported yet.
 *
 * @param array
 * @param start
 * @param end
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
