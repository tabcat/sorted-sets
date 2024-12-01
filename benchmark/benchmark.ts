import Benchmark from "benchmark"
import { comparator, createNumbers } from "../test/helpers/sets.js"
import { safeArrayAccess } from "../src/util.js"
import { difference, symmetric } from "../src/difference.js"
import { union } from '../src/union.js'
import { intersection } from "../src/intersection.js"
import { filter, map } from "iter-tools-es"

const setSizes = [1000]
const lotsOfIterables = setSizes.map(size => () => createNumbers(size))
const lotsOfSets = [...map(iter => new Set([...iter()]), lotsOfIterables)]

// Set class implementation of a set operation
interface SetImpl {
  (s: Set<number>, t: Set<number>): Set<number>
}

// sorted-set implementation of a set operation
interface SortedImpl {
  (s: Iterable<number>, t: Iterable<number>, comparator: (a: number, b: number) => number): Generator<number>
}

const versusSet = (setImpl: SetImpl, sortedImpl: SortedImpl, name: string, index: number): void => {
  const sample = filter(() => Math.random() > 0.5, safeArrayAccess(lotsOfIterables, index)())
  const sampleSet = new Set(sample)

  new Benchmark.Suite()
  .add(`${name}\timpl: Set\t\tsize: ${safeArrayAccess(setSizes, index)}`, (): void => {
    setImpl(safeArrayAccess(lotsOfSets, index), sampleSet)
  })
  .add(`${name}\timpl: sorted-sets\tsize: ${safeArrayAccess(setSizes, index)}`, (): void => {
    for (const _ of sortedImpl(safeArrayAccess(lotsOfIterables, index)(), sample, comparator)) {}
  })
  .on('cycle', (event: any) => {
    console.log(String(event.target))
  })
  .run()
}

export const versusSets = (setImpl: SetImpl, sortedImpl: SortedImpl, name: string): void => {
  setSizes.map((_, index) => versusSet(setImpl, sortedImpl, name, index))
}

/**
 * Returns the difference of two sets using the Set class.
 * 
 * @param minuend 
 * @param subtrahend 
 */
const _difference = <T>(minuend: Set<T>, subtrahend: Set<T>): Set<T> => {
  const r: Set<T> = new Set(minuend)

  for (const element of subtrahend) {
    if (r.has(element)) r.delete(element)
  }

  return r
}

/**
 * Returns the difference of two sets using the Set class.
 * 
 * @param source 
 * @param target
 */
const _symmetric = <T>(source: Set<T>, target: Set<T>): Set<T> => {
  const r: Set<T> = new Set()

  for (const element of source) {
    if (!target.has(element)) r.add(element)
  }

  for (const element of target) {
    if (!source.has(element)) r.add(element)
  }

  return r
}

/**
 * Returns the union of two sets using the Set class.
 * 
 * @param source
 * @param target
 */
const _union = <T>(source: Set<T>, target: Set<T>): Set<T> => {
  const r: Set<T> = new Set(source)

  for (const element of target) {
    r.add(element)
  }

  return r
}

/**
 * Returns the intersection of two sets using the Set class.
 * 
 * @param source
 * @param target
 */
const _intersection = <T>(source: Set<T>, target: Set<T>): Set<T> => {
  const r: Set<T> = new Set(source)

  for (const element of target) {
    r.add(element)
  }

  return r
}

versusSets(_difference, difference, 'difference')
versusSets(_symmetric, symmetric, 'symmetric')
versusSets(_union, union, 'union\t')
versusSets(_intersection, intersection, 'intersection')
