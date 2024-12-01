import { pairwiseTraversal, type Range } from "./util.js";

/**
 * Splits a set into multiple sets at sector points.
 *
 * @param source - Set to split at each sector point (inclusive)
 * @param sectors - Set of sector points
 * @param comparator - Used to compare two set elements, same as Array.sort parameter
 */
export function* split<T, B extends T>(
  source: Iterable<B>,
  sectors: Iterable<T>,
  comparator: (a: T, b: T) => number,
): Generator<B[]> {
  let empty = true;
  let section: B[] = [];

  for (const [a, b] of pairwiseTraversal(source, sectors, comparator)) {
    if (empty === true) empty = false;

    if (a !== null) {
      section.push(a);
    }

    if (b !== null) {
      yield section;
      section = [];
    }
  }

  if (section.length > 0 || empty) yield section;
}

export function* ranges<T, B extends T>(
  source: Iterable<B>,
  sectors: Iterable<T>,
  comparator: (a: T, b: T) => number,
  offset: number = 0,
): Generator<Range> {
  if (offset < 0) {
    throw new Error("offset cannot be negative");
  }

  let empty: boolean = true;
  let range: Range = [offset, offset];

  for (const [element, sector] of pairwiseTraversal(
    source,
    sectors,
    comparator,
  )) {
    if (empty === true) empty = false;

    if (element !== null) {
      range[1] += 1;
    }

    if (sector !== null) {
      yield range;
      range = [range[1], range[1]];
    }
  }

  if (range[0] < range[1] || empty) yield range;
}
