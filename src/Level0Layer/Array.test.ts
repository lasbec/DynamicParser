import { describe, expect, it } from "vitest";
import { NumAsc, SortedArray, sortArray } from "./Array";
describe("SortedArray", () => {
  it("NumAsc", () => {
    const arr = [1, 5, 2, 4];

    const sorted: SortedArray<NumAsc> = sortArray(NumAsc)(arr);
    const arr0: ReadonlyArray<number> = sorted;
    const arr1: Array<number> = [...sorted];
    // @ts-expect-error
    const arr2: ReadonlyArray<string> = sorted;
    expect(sorted).toEqual([1, 2, 4, 5]);
  });
});
