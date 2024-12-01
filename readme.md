# sorted-sets

Utilities for working with sorted sets.

- Zero Dependencies
- Uses ES6 Iterables

Core of library is the `pairwiseTraversal` generator in [src/util.ts](https://github.com/tabcat/sorted-sets/blob/master/src/util.ts).

## API Docs

https://tabcat.github.io/sorted-sets/

## Install

Available from NPM at name: `@tabcat/sorted-sets`

## Build

In this package we use [PNPM](https://pnpm.io/)

```
pnpm install
pnpm build
```

## Performance

This library provides efficient operations for sorted sets.

May be useful in the following cases:

- Set elements must remain in order.
- Set elements are expensive to store as primitives.

If none of these apply, it's probably better to implement the needed operations using Javascript's Set class.

### Benchmarks

There's a very simple benchmark comparing the set operations difference, symmetric difference, union and intersection implemented in this library versus an implementation using Set.

```
pnpm install
pnpm benchmark
```

Output should look something like this:

```
difference      impl: Set               size: 1000 x 43,716 ops/sec ±0.72% (92 runs sampled)
difference      impl: sorted-sets      size: 1000 x 22,283 ops/sec ±0.16% (97 runs sampled)
symmetric       impl: Set               size: 1000 x 74,039 ops/sec ±0.17% (96 runs sampled)
symmetric       impl: sorted-sets      size: 1000 x 22,269 ops/sec ±0.21% (98 runs sampled)
union           impl: Set               size: 1000 x 49,286 ops/sec ±0.21% (97 runs sampled)
union           impl: sorted-sets      size: 1000 x 22,304 ops/sec ±0.12% (100 runs sampled)
intersection    impl: Set               size: 1000 x 44,572 ops/sec ±1.70% (89 runs sampled)
intersection    impl: sorted-sets      size: 1000 x 7,387,917 ops/sec ±0.19% (99 runs sampled)
```

## Extension

If you have a usecase for a missing feature be sure to make an issue.
Have been thinking about building a merge function.
