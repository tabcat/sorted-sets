import { pairwiseTraversal } from "./util.js";

/**
 * Yields the intersection of two sorted sets.
 *
 * @param source - Set from which matched element will be yielded
 * @param target - Set of elements to check for matches
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* intersection<T, A extends T>(
  source: Iterable<A>,
  target: Iterable<T>,
  comparator: (a: T, b: T) => number,
): Generator<A> {
  for (const [s, t, sourceDone, targetDone] of pairwiseTraversal(
    source,
    target,
    comparator,
  )) {
    if (s !== null && t !== null) {
      yield s;
    }

    if (sourceDone || targetDone) {
      break;
    }
  }
}
