import { Char } from "./Char";

export type Primitive =
  | null
  | undefined
  | string
  | boolean
  | number
  | bigint
  | symbol;

const primitveTypeofTypes = new Set<unknown>([
  "undefined",
  "string",
  "number",
  "bigint",
  "symbol",
  "boolean",
]);

export function isPrimitive(x: unknown): x is Primitive {
  if (x === null) return true;
  return primitveTypeofTypes.has(typeof x);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isArray(
  arg: ReadonlyArray<any> | any
): arg is ReadonlyArray<any> {
  return Array.isArray(arg);
}

export type Nullish = null | undefined;
export function notNullish<T>(arg: T): arg is Exclude<T, Nullish> {
  return arg !== undefined && arg !== null;
}
