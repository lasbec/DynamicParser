import { describe, it, expect } from "vitest";
import { shuffle, popRandomElement, randomArray } from "./Array";
import { getRandomInt } from "./Basics";

describe("Shuffle", () => {
  it("should return a new array", () => {
    const arr = [1];
    expect(shuffle(arr)).not.toBe(arr);
  });
  it("should (with tremendous propability) return an unequal array", () => {
    const arr = randomArray(10);
    expect(shuffle(arr)).not.toEqual(arr);
  });
  it("should return an array with the same elements", () => {
    const arr = randomArray(100);
    for (const el of shuffle(arr)) {
      expect(arr.includes(el)).toBeTruthy();
    }
  });
  for (const l of Array(10).fill(getRandomInt(0, 10))) {
    it("should return an array of the same lenght", () => {
      const arr = randomArray(l);
      expect(shuffle(arr).length).toEqual(l);
    });
  }
});

describe("popRandomElement", () => {
  it("should return an element from array", () => {
    const arr: (number | undefined)[] = randomArray(10);
    const cpy = [...arr];

    const result = popRandomElement(cpy);
    expect(arr.includes(result)).toBeTruthy();
  });

  it("should decrease array lenght by 1", () => {
    const arr = randomArray(10);
    const cpy = [...arr];

    const result = popRandomElement(cpy);
    expect(cpy.length).toEqual(9);
  });
});
