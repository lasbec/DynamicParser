import { describe, expect, it } from "vitest";
import { DefaultAsc, SortedArray, sortArray } from "./Array";
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
});
