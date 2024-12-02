import { map, slice } from "iter-tools-es";
import { describe, expect, test } from "vitest";
import { ranges, split } from "../src/split.js";
import { safeArrayAccess } from "../src/util.js";
import { isGenerator } from "./helpers/isGenerator.js";
import { comparator, empty, even, numbers, odd } from "./helpers/sets.js";
import { testNames } from "./helpers/test-names.js";

describe("split", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(split(empty(), empty(), comparator))).toBe(true);
  });

  describe("finds split of two sorted sets", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...split(empty(), empty(), comparator)]).toEqual([[]]);
    });

    test(testNames.firstEmpty, () => {
      expect([...split(empty(), numbers(), comparator)]).toEqual([
        ...map((_) => [], numbers()),
      ]);
    });

    test(testNames.secondEmpty, () => {
      expect([...split(numbers(), empty(), comparator)]).toEqual([
        [...numbers()],
      ]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...split(slice(0, 1, numbers()), slice(0, 1, numbers()), comparator),
      ]).toEqual([[...slice(0, 1, numbers())]]);
    });

    test(testNames.identical, () => {
      expect([...split(numbers(), numbers(), comparator)]).toEqual([
        ...map((n) => [n], numbers()),
      ]);
    });

    test(testNames.partialOverlap, () => {
      expect([...split(numbers(), even(), comparator)]).toEqual([
        ...map(
          (n, i) =>
            [...odd()][i - 1] == null
              ? [n]
              : [safeArrayAccess([...odd()], i - 1), n],
          even(),
        ),
        [[...odd()][[...odd()].length - 1]],
      ]);
      expect([...split(numbers(), odd(), comparator)]).toEqual([
        ...map((n, i) => [safeArrayAccess([...even()], i), n], odd()),
      ]);
    });

    test(testNames.noOverlap, () => {
      expect([...split(even(), odd(), comparator)]).toEqual([
        ...map((n) => [n], even()),
      ]);
      expect([...split(odd(), even(), comparator)]).toEqual([
        [],
        ...map((n) => [n], odd()),
      ]);
    });
  });
});

describe("ranges", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(ranges(empty(), empty(), comparator))).toBe(true);
  });

  describe("finds ranges of two sorted sets", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...ranges(empty(), empty(), comparator)]).toEqual([[0, 0]]);
    });

    test(testNames.firstEmpty, () => {
      expect([...ranges(empty(), numbers(), comparator)]).toEqual([
        ...map((_) => [0, 0], numbers()),
      ]);
    });

    test(testNames.secondEmpty, () => {
      expect([...ranges(numbers(), empty(), comparator)]).toEqual([
        [0, [...numbers()].length],
      ]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...ranges(slice(0, 1, numbers()), slice(0, 1, numbers()), comparator),
      ]).toEqual([...map((_, i) => [i, i + 1], slice(0, 1, numbers()))]);
    });

    test(testNames.identical, () => {
      expect([...ranges(numbers(), numbers(), comparator)]).toEqual([
        ...map((_, i) => [i, i + 1], numbers()),
      ]);
    });

    test(testNames.partialOverlap, () => {
      expect([...ranges(numbers(), even(), comparator)]).toEqual([
        [0, 1],
        ...map((n) => [n, Math.min([...numbers()].length, n + 2)], odd()),
      ]);
      expect([...ranges(numbers(), odd(), comparator)]).toEqual([
        ...map((n) => [n, n + 2], even()),
      ]);
    });

    test(testNames.noOverlap, () => {
      expect([...ranges(even(), odd(), comparator)]).toEqual([
        ...map((_, i) => [i, i + 1], even()),
      ]);
      expect([...ranges(odd(), even(), comparator)]).toEqual([
        [0, 0],
        ...map((_, i) => [i, i + 1], odd()),
      ]);
    });
  });
});
