import { slice } from "iter-tools-es";
import { describe, expect, test } from "vitest";
import { intersection } from "../src/intersection.js";
import { isGenerator } from "./helpers/isGenerator.js";
import { comparator, empty, even, numbers, odd } from "./helpers/sets.js";
import { testNames } from "./helpers/test-names.js";

describe("intersection", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(intersection(empty(), empty(), comparator))).toBe(true);
  });

  describe("finds intersection of two sorted sets", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...intersection(empty(), empty(), comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...intersection(empty(), numbers(), comparator)]).toEqual([]);
    });

    test(testNames.secondEmpty, () => {
      expect([...intersection(numbers(), empty(), comparator)]).toEqual([]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...intersection(
          slice(0, 1, numbers()),
          slice(0, 1, numbers()),
          comparator,
        ),
      ]).toEqual([0]);
    });

    test(testNames.identical, () => {
      expect([...intersection(numbers(), numbers(), comparator)]).toEqual([
        ...numbers(),
      ]);
    });

    test(testNames.partialOverlap, () => {
      expect([...intersection(numbers(), even(), comparator)]).toEqual([
        ...even(),
      ]);
      expect([...intersection(numbers(), odd(), comparator)]).toEqual([
        ...odd(),
      ]);
    });

    test(testNames.noOverlap, () => {
      expect([...intersection(even(), odd(), comparator)]).toEqual([]);
      expect([...intersection(odd(), even(), comparator)]).toEqual([]);
    });
  });
});
