import { describe, test, expect } from "vitest";
import { map, slice } from "iter-tools-es";
import { difference, symmetric, diff } from "../src/difference.js";
import { comparator, empty, even, numbers, odd } from "./helpers/sets.js";
import { isGenerator } from "./helpers/isGenerator.js";
import { testNames } from "./helpers/test-names.js";

describe("difference", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(difference(empty(), empty(), comparator))).toBe(true);
  });

  describe("finds set difference", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...difference(empty(), empty(), comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...difference(empty(), numbers(), comparator)]).toEqual([]);
    });

    test(testNames.secondEmpty, () => {
      expect([...difference(numbers(), empty(), comparator)]).toEqual([
        ...numbers(),
      ]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...difference(
          slice(0, 1, numbers()),
          slice(0, 1, numbers()),
          comparator
        ),
      ]).toEqual([]);
    });

    test(testNames.identical, () => {
      expect([...difference(numbers(), numbers(), comparator)]).toEqual([]);
    });

    test(testNames.partialOverlap, () => {
      expect([...difference(numbers(), even(), comparator)]).toEqual([
        ...odd(),
      ]);
      expect([...difference(numbers(), odd(), comparator)]).toEqual([
        ...even(),
      ]);
    });

    test(testNames.noOverlap, () => {
      expect([...difference(even(), odd(), comparator)]).toEqual([...even()]);
      expect([...difference(odd(), even(), comparator)]).toEqual([...odd()]);
    });
  });
});

describe("symmetric", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(symmetric(empty(), empty(), comparator))).toBe(true);
  });

  describe("finds set symmetric difference", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...symmetric(empty(), empty(), comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...symmetric(empty(), numbers(), comparator)]).toEqual([
        ...numbers(),
      ]);
    });

    test(testNames.secondEmpty, () => {
      expect([...symmetric(numbers(), empty(), comparator)]).toEqual([
        ...numbers(),
      ]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...symmetric(
          slice(0, 1, numbers()),
          slice(0, 1, numbers()),
          comparator
        ),
      ]).toEqual([]);
    });

    test(testNames.identical, () => {
      expect([...symmetric(numbers(), numbers(), comparator)]).toEqual([]);
    });

    test(testNames.partialOverlap, () => {
      expect([...symmetric(numbers(), even(), comparator)]).toEqual([...odd()]);
      expect([...symmetric(numbers(), odd(), comparator)]).toEqual([...even()]);
    });

    test(testNames.noOverlap, () => {
      expect([...symmetric(even(), odd(), comparator)]).toEqual([...numbers()]);
      expect([...symmetric(odd(), even(), comparator)]).toEqual([...numbers()]);
    });
  });
});

describe("diff", () => {
  test(testNames.returnsGenerator, () => {
    expect(isGenerator(diff(empty(), empty(), comparator))).toBe(true);
  });

  describe("finds pairwise set symmetric difference", () => {
    test(testNames.firstAndSecondEmpty, () => {
      expect([...diff(empty(), empty(), comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...diff(empty(), numbers(), comparator)]).toEqual([
        ...map((n) => [null, n], numbers()),
      ]);
    });

    test(testNames.secondEmpty, () => {
      expect([...diff(numbers(), empty(), comparator)]).toEqual([
        ...map((n) => [n, null], numbers()),
      ]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...diff(slice(0, 1, numbers()), slice(0, 1, numbers()), comparator),
      ]).toEqual([]);
    });

    test(testNames.identical, () => {
      expect([...diff(numbers(), numbers(), comparator)]).toEqual([]);
    });

    test(testNames.partialOverlap, () => {
      expect([...diff(numbers(), even(), comparator)]).toEqual([
        ...map((n) => [n, null], odd()),
      ]);
      expect([...diff(numbers(), odd(), comparator)]).toEqual([
        ...map((n) => [n, null], even()),
      ]);
    });

    test(testNames.noOverlap, () => {
      expect([...diff(even(), odd(), comparator)]).toEqual([
        ...map(
          (n) => [n % 2 === 0 ? n : null, n % 2 === 1 ? n : null],
          numbers()
        ),
      ]);
      expect([...diff(odd(), even(), comparator)]).toEqual([
        ...map(
          (n) => [n % 2 === 1 ? n : null, n % 2 === 0 ? n : null],
          numbers()
        ),
      ]);
    });
  });

  describe("finds pairwise set union when using differ", () => {
    const differ = () => true;

    test(testNames.firstAndSecondEmpty, () => {
      expect([...diff(empty(), empty(), comparator)]).toEqual([]);
    });

    test(testNames.firstEmpty, () => {
      expect([...diff(empty(), numbers(), comparator)]).toEqual([
        ...map((n) => [null, n], numbers()),
      ]);
    });

    test(testNames.secondEmpty, () => {
      expect([...diff(numbers(), empty(), comparator)]).toEqual([
        ...map((n) => [n, null], numbers()),
      ]);
    });

    test(testNames.identicalSingle, () => {
      expect([
        ...diff(
          slice(0, 1, numbers()),
          slice(0, 1, numbers()),
          comparator,
          differ
        ),
      ]).toEqual([...map((n) => [n, n], slice(0, 1, numbers()))]);
    });

    test(testNames.identical, () => {
      expect([...diff(numbers(), numbers(), comparator, differ)]).toEqual([
        ...map((n) => [n, n], numbers()),
      ]);
    });

    test(testNames.partialOverlap, () => {
      expect([...diff(numbers(), even(), comparator, differ)]).toEqual([
        ...map((n) => [n, n % 2 === 0 ? n : null], numbers()),
      ]);
      expect([...diff(numbers(), odd(), comparator, differ)]).toEqual([
        ...map((n) => [n, n % 2 !== 0 ? n : null], numbers()),
      ]);
    });

    test(testNames.noOverlap, () => {
      expect([...diff(even(), odd(), comparator, differ)]).toEqual([
        ...map(
          (n) => [n % 2 === 0 ? n : null, n % 2 === 1 ? n : null],
          numbers()
        ),
      ]);
      expect([...diff(odd(), even(), comparator, differ)]).toEqual([
        ...map(
          (n) => [n % 2 === 1 ? n : null, n % 2 === 0 ? n : null],
          numbers()
        ),
      ]);
    });
  });
});
