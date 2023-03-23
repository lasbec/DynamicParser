import { describe, expect, it } from "vitest";
import {
  findBinary,
  DefaultAsc,
  SortedArray,
  sortArray,
  findClosestIntexBinary,
  emptyArray,
} from "./Array";
describe("SortedArray", () => {
  it("NumAsc", () => {
    const arr = [1, 5, 2, 4];

    const sorted: SortedArray<DefaultAsc<number>> = sortArray(
      DefaultAsc<number>()
    )(arr);
    const arr0: ReadonlyArray<number> = sorted;
    const arr1: Array<number> = [...sorted];
    // @ts-expect-error
    const arr2: ReadonlyArray<string> = sorted;
    expect(sorted).toEqual([1, 2, 4, 5]);
  });

  it("LexAsc", () => {
    const arr = ["a", " ", "A", "_", "s", ""];

    const sorted: SortedArray<DefaultAsc> = sortArray(DefaultAsc())(arr);
    // @ts-expect-error
    const arr0: ReadonlyArray<number> = sorted;
    const arr1: Array<number | string | bigint> = [...sorted];
    // @ts-expect-error
    const arr2: ReadonlyArray<string> = sorted;
    expect(sorted).toEqual(["", " ", "A", "_", "a", "s"]);
  });

  it("LexAsc 2", () => {
    const arr = ["a", " ", "", "s", "_", "A"];

    const sorted = sortArray(DefaultAsc())(arr);
    expect(sorted).toEqual(["", " ", "A", "_", "a", "s"]);
  });

  it("Default comaparer 0", () => {
    expect(DefaultAsc().compare("_", "_")).toEqual("left=right");
  });

  it("Default comaparer 1", () => {
    expect(DefaultAsc().compare("_", "]")).toEqual("left>right");
  });

  it("binary search", () => {
    const arr = ["a", " ", "A", "_", "s", ""];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(3);
  });

  it("binary search empty", () => {
    const arr: string[] = [];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(null);
  });

  it("binary search one element fail", () => {
    const arr: string[] = ["r"];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(null);
  });

  it("binary search one element succ", () => {
    const arr: string[] = ["_"];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(0);
  });

  it("binary search tow elements fail", () => {
    const arr: string[] = ["1", "2"];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(null);
  });

  it("sort tow elements", () => {
    const arr: string[] = ["1", "2"];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(sorted).toEqual(["1", "2"]);
  });

  it("binary search succes on first", () => {
    const arr: string[] = ["", "2", "654", "96"];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findBinary(DefaultAsc<string>())(sorted)("")).toEqual(0);
  });
  it("binary search sucess on last", () => {
    const arr: string[] = ["1", "65", "(", ""];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findClosestIntexBinary(DefaultAsc<string>())(sorted)("65")).toEqual(
      3
    );
  });

  it("sort 4 elements", () => {
    const arr: string[] = ["1", "65", "(", ""];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(sorted).toEqual(["", "(", "1", "65"]);
  });

  it("closest index simple", () => {
    const arr = ["a", " ", "A", "_", "s", ""];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findClosestIntexBinary(DefaultAsc<string>())(sorted)("_")).toEqual(
      3
    );
  });
});
