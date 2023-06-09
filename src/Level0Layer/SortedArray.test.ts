import { describe, expect, it } from "vitest";
import {
  findBinary,
  DefaultAsc,
  SortedArray,
  sortArray,
  findIndexNextSmaller,
  emptyArray,
  insertBinary,
  asSorted,
} from "./SortedArray";
import { range, shuffle, randomArray } from "./Array";
import { isSorted } from "./SortedArray";
describe("SortedArray", () => {
  const asSortedNum = asSorted(DefaultAsc<number>());
  const isSortedNum = isSorted(DefaultAsc<number>());
  const asSortedStr = asSorted(DefaultAsc<string>());
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
    const sorted = asSortedStr(["", " ", "A", "_", "a", "s"]);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(3);
  });

  it("binary search empty", () => {
    const sorted = emptyArray(DefaultAsc<string>());
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(null);
  });

  it("binary search one element fail", () => {
    const sorted = asSortedStr(["r"]);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(null);
  });

  it("binary search one element succ", () => {
    const sorted = asSortedStr(["_"]);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(0);
  });

  it("binary search tow elements fail", () => {
    const sorted = asSortedStr(["1", "2"]);
    expect(findBinary(DefaultAsc<string>())(sorted)("_")).toEqual(null);
  });

  it("sort tow elements", () => {
    const arr: string[] = ["1", "2"];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(sorted).toEqual(["1", "2"]);
  });

  it("binary search succes on first", () => {
    const sorted = asSortedStr(["", "2", "654", "96"]);
    expect(findBinary(DefaultAsc<string>())(sorted)("")).toEqual(0);
  });
  it("binary closest with 4 elements", () => {
    const arr: string[] = ["", "1", "(", "65"];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findIndexNextSmaller(DefaultAsc<string>())(sorted)("65")).toEqual(2);
  });

  it("sort 4 elements", () => {
    const arr: string[] = ["1", "65", "(", ""];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(sorted).toEqual(["", "(", "1", "65"]);
  });

  it("closest index one element", () => {
    const arr = ["a"];

    const sorted = sortArray(DefaultAsc<string>())(arr);
    expect(findIndexNextSmaller(DefaultAsc<string>())(sorted)("b")).toEqual(0);
  });

  it("insert one", () => {
    const start = emptyArray(DefaultAsc<string>());
    const insert = insertBinary(DefaultAsc<string>());
    const result = insert(start)("a");
    expect(result).toEqual(["a"]);
  });
  it("insert tow", () => {
    const start = emptyArray(DefaultAsc<string>());
    const insert = insertBinary(DefaultAsc<string>());
    const result = insert(insert(start)("a"))("b");
    expect(result).toEqual(["a", "b"]);
  });

  it("isSorted false", () => {
    expect(isSortedNum([1, 2, 4, 1])).toEqual(false);
  });
  it("isSorted true", () => {
    expect(isSortedNum([1, 2, 4])).toEqual(true);
  });

  // it("insert five numbers", () => {
  //   const start = emptyArray(DefaultAsc<number>());
  //   const insert = insertBinary(DefaultAsc<number>());
  //   const result = insert(insert(insert(insert(insert(start)(1))(5))(1))(-1))(
  //     17
  //   );
  //   expect(result).toEqual([-1, 1, 1, 5, 17]);
  // });

  it("find index number 17", () => {
    const start = asSortedNum([-1, 1, 1, 5]);
    const findClosest = findIndexNextSmaller(DefaultAsc<number>());
    const result = findClosest(start)(17);
    expect(result).toEqual(3);
  });

  // for (const i of range(10)) {
  //   it("PROPERTY: inserting one another should result in the same as sort", () => {
  //     const arr: Array<number> = randomArray(i);
  //     const insert = insertBinary(DefaultAsc<number>());
  //     let resultByInsertion = emptyArray(DefaultAsc<number>());
  //     for (const n of arr) {
  //       resultByInsertion = insert(resultByInsertion)(n);
  //     }
  //     const resultBySorting = sortArray(DefaultAsc<number>())(arr);
  //     expect(resultByInsertion).toEqual(resultBySorting);
  //   });
  // }

  // for (const i of range(10)) {
  //   it("PROPERTY: inserting order should not matter", () => {
  //     const arr1: Array<string> = Array(i)
  //       .fill(Math.random)
  //       .map((x) => `${x}`);
  //     const arr2 = shuffle(arr1);

  //     const insert = insertBinary(DefaultAsc<string>());
  //     let result1 = emptyArray(DefaultAsc<string>());
  //     for (const n of arr1) {
  //       result1 = insert(result1)(n);
  //     }

  //     let result2 = emptyArray(DefaultAsc<string>());
  //     for (const n of arr2) {
  //       result2 = insert(result2)(n);
  //     }

  //     expect(result1).toEqual(result2);
  //     expect(arr1).toEqual(arr2);
  //   });
  // }
});
