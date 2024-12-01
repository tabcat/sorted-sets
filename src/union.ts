import { pairwiseTraversal } from "./util.js";

/**
 * Yields the union of two sorted sets.
 *
 * @param source - Set of elements to add to union
 * @param target - Set of elements to also add to union
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* union<T, B extends T>(
  source: Iterable<B>,
  target: Iterable<B>,
  comparator: (a: T, b: T) => number,
): Generator<B> {
  for (const [s, t] of pairwiseTraversal(source, target, comparator)) {
    yield (s ?? t)!;
  }
}
