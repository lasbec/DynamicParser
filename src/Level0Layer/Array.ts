import { N } from "vitest/dist/types-5872e574";
import { getRandomInt } from "./Basics";
/**
 * Returns a shuffled version of an array.
 */
export function shuffle<T>(arr: ReadonlyArray<T>): Array<T> {
  const result: Array<T> = [];
  const cpy = [...arr];
  while (cpy.length) {
    const randomElement = popRandomElement(cpy);
    result.push(randomElement as T);
  }
  return result;
}

/**
 * Removes an element from the given array and returns it.
 */
export function popRandomElement<T>(arr: Array<T>): T | undefined {
  const randomIndex = getRandomInt(0, arr.length - 1);
  const [result] = arr.splice(randomIndex, 1);
  return result;
}

export interface RandomIntArrayConfig {
  len: number;
  max: number;
  min: number;
}
export function randomIntArray(conf: RandomIntArrayConfig): Array<number> {
  return range(conf.len).map(() => getRandomInt(conf.min, conf.max));
}

export function randomArray(lenght: number): Array<number> {
  return range(lenght).map(() => Math.random());
}

export function range(lenght: number): Array<number> {
  return Array(lenght)
    .fill(null)
    .map((_, i) => i);
}
