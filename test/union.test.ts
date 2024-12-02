import { slice } from "iter-tools-es";
import { describe, expect, test } from "vitest";
import { union } from "../src/union.js";
import { isGenerator } from "./helpers/isGenerator.js";
import { comparator, empty, even, numbers, odd } from "./helpers/sets.js";
import { testNames } from "./helpers/test-names.js";

describe("union", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(union([], [], comparator))).toBe(true);
  });

  describe("finds union of two sorted sets", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...union(empty(), empty(), comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...union(empty(), numbers(), comparator)]).toEqual([
        ...numbers(),
      ]);
    });

    test(testNames.secondEmpty, () => {
      expect([...union(numbers(), empty(), comparator)]).toEqual([
        ...numbers(),
      ]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...union(slice(0, 1, numbers()), slice(0, 1, numbers()), comparator),
      ]).toEqual([...slice(0, 1, numbers())]);
    });

    test(testNames.identical, () => {
      expect([...union(numbers(), numbers(), comparator)]).toEqual([
        ...numbers(),
      ]);
    });

    test(testNames.partialOverlap, () => {
      expect([...union(numbers(), even(), comparator)]).toEqual([...numbers()]);
      expect([...union(numbers(), odd(), comparator)]).toEqual([...numbers()]);
    });

    test(testNames.noOverlap, () => {
      expect([...union(even(), odd(), comparator)]).toEqual([...numbers()]);
      expect([...union(odd(), even(), comparator)]).toEqual([...numbers()]);
    });
  });
});
