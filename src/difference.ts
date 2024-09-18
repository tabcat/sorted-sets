import { pairwiseTraversal } from "./util.js";

/**
 * Yields the difference of two ordered sets.
 *
 * @param minuend - Set from which to remove elements
 * @param subtrahend - Set of elements to be removed
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* difference<T, B extends T>(
  minuend: Iterable<B>,
  subtrahend: Iterable<T>,
  comparator: (a: T, b: T) => number,
): Generator<B> {
  for (const [m, s] of pairwiseTraversal(minuend, subtrahend, comparator)) {
    if (s === null) {
      yield m!;
    }
  }
}

/**
 * Yields the symmetric difference of two ordered sets.
 *
 * @param minuend - Source ordered set
 * @param subtrahend - Target ordered set
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* symmetric<T, B extends T>(
  minuend: Iterable<B>,
  subtrahend: Iterable<B>,
  comparator: (a: T, b: T) => number,
): Generator<B> {
  for (const [s, t] of pairwiseTraversal(minuend, subtrahend, comparator)) {
    if (s === null) {
      yield t!;
    }

    if (t === null) {
      yield s!;
    }
  }
}

export type ExclusiveDiff<T> = [T, null] | [null, T];
export type Diff<T> = ExclusiveDiff<T> | [T, T];

/**
 * Yields the pairwise symmetric difference of two ordered sets.
 *
 * @param source - Source ordered set
 * @param target - Target ordered set
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 * @param differ - Used to compare two set elements of the same comparator value
 */
export function diff<T, B extends T>(
  source: Iterable<B>,
  target: Iterable<B>,
  comparator: (a: T, b: T) => number
): Generator<ExclusiveDiff<B>>;
export function diff<T, B extends T>(
  source: Iterable<B>,
  target: Iterable<B>,
  comparator: (a: T, b: T) => number,
  differ: (a: T, b: T) => boolean
): Generator<ExclusiveDiff<B>>;
export function* diff<T, B extends T>(
  source: Iterable<B>,
  target: Iterable<B>,
  comparator: (a: T, b: T) => number,
  differ?: (a: T, b: T) => boolean
): Generator<Diff<B>> {
  for (const [s, t] of pairwiseTraversal(source, target, comparator)) {
    if (s != null && t != null) {
      if (differ != null && differ(s, t)) {
        yield [s, t] as Diff<B>;
      }
    } else {
      yield [s, t] as ExclusiveDiff<B>;
    }
  }
}
