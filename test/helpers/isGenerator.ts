export const isGenerator = (g: Generator<unknown>): boolean =>
  g[Symbol.iterator] != null && typeof g.next === "function";

export const isAsyncGenerator = (g: AsyncGenerator<unknown>): boolean =>
  g[Symbol.asyncIterator] != null && typeof g.next === "function";
