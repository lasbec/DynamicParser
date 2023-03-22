import { Char } from "./Char";

export type Primitive = null | undefined | string | number | bigint | symbol;

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
