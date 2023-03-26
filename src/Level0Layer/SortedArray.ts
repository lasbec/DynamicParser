import { expect } from "vitest";
import { escapeRegExp } from "../Level1Layer/Escaper";
type CompareResult = "left<right" | "left=right" | "left>right";

type Comparison<T, Name extends string> = {
  compare(left: T, right: T): CompareResult;
  readonly id: Name;
};

const compareMapping: Record<CompareResult, -1 | 0 | 1> = {
  "left<right": -1,
  "left=right": 0,
  "left>right": 1,
};

export type SortedArray<C extends Comparison<any, any>> = C extends Comparison<
  infer T,
  infer Name
>
  ? ReadonlyArray<T> & `Sorted by ${Name}`
  : "ERROR comparison name could not be infered." & never;

type GetComparisonName<C extends Comparison<any, any>> = C extends Comparison<
  any,
  infer Name
>
  ? Name
  : never & "ERROR";
type GetComparisonType<C extends Comparison<any, any>> = C extends Comparison<
  infer T,
  any
>
  ? T
  : never & "ERROR";

export function isSorted<C extends Comparison<any, any>>(comp: C) {
  return (arr: ReadonlyArray<GetComparisonType<C>>): arr is SortedArray<C> => {
    if (!arr.length) return true;
    let previous: GetComparisonType<C> = arr[0];
    for (const el of arr.slice(1)) {
      if (comp.compare(previous, el) === "left>right") return false;
      previous = el;
    }
    return true;
  };
}

export function assertSorted<C extends Comparison<any, any>>(comp: C) {
  const checker = isSorted(comp);
  return (
    arr: ReadonlyArray<GetComparisonType<C>>,
    errMsg?: string
  ): asserts arr is SortedArray<C> => {
    if (!checker(arr))
      throw new Error(errMsg || `Expected array to be sorted.`);
  };
}

export function asSorted<C extends Comparison<any, any>>(comp: C) {
  const _assertSorted: (
    arr: ReadonlyArray<GetComparisonType<C>>,
    errMsg?: string
  ) => asserts arr is SortedArray<C> = assertSorted(comp);
  return (
    arr: ReadonlyArray<GetComparisonType<C>>,
    errMsg?: string
  ): SortedArray<C> => {
    _assertSorted(arr, errMsg);
    return arr;
  };
}

export function sortArray<C extends Comparison<any, any>>(comp: C) {
  return (arr: ReadonlyArray<GetComparisonType<C>>) => {
    const result: Array<GetComparisonType<C>> = [...arr];
    result.sort((l, r) => {
      return compareMapping[comp.compare(l, r)];
    });
    return result as unknown as SortedArray<C>;
  };
}

export function emptyArray<C extends Comparison<any, any>>(comp: C) {
  return [] as unknown as SortedArray<C>;
}

export function sliceOf<C extends Comparison<any, any>>(arr: SortedArray<C>) {
  return (start: number, end?: number) => {
    return arr.slice(start, end) as unknown as SortedArray<C>;
  };
}

export function insertBinary<C extends Comparison<any, any>>(comp: C) {
  const compSet = findClosestIndex(comp);
  return (arr: SortedArray<C>) => {
    const findIndex = compSet(arr);
    return (element: GetComparisonType<C>): SortedArray<C> => {
      const result = findIndex(element);
      if (result === null) return [element] as unknown as SortedArray<C>;
      const [i, comp] = result;
      return comp === "left>right"
        ? ([
            ...arr.slice(0, i + 1),
            element,
            ...arr.slice(i + 1),
          ] as unknown as SortedArray<C>)
        : ([
            ...arr.slice(0, i),
            element,
            ...arr.slice(i),
          ] as unknown as SortedArray<C>);
    };
  };
}

export function findClosestIndex<C extends Comparison<any, any>>(comp: C) {
  return (arr: SortedArray<C>) => {
    return (element: GetComparisonType<C>): [number, CompareResult] | null => {
      if (arr.length === 0) {
        return null;
      }
      if (arr.length === 1) {
        return [0, comp.compare(element, arr[0])];
      }
      const resultRange: [number, number] = [0, arr.length - 1];
      let middleIndex = Math.floor(resultRange[0] + resultRange[1] / 2);
      while (resultRange[0] < resultRange[1]) {
        middleIndex = Math.floor((resultRange[0] + resultRange[1]) / 2);
        const comparison = comp.compare(arr[middleIndex], element);
        if (comparison === "left=right") {
          return [middleIndex, "left=right"];
        }
        if (middleIndex === resultRange[0] || middleIndex === resultRange[1]) {
          return comp.compare(arr[resultRange[1]], element) === "left=right"
            ? [resultRange[1], "left=right"]
            : [resultRange[0], comp.compare(element, resultRange[0])];
        }
        if (comparison === "left<right") {
          resultRange[0] = middleIndex;
          continue;
        }
        if (comparison === "left>right") {
          resultRange[1] = middleIndex;
          continue;
        }
        throw new Error(
          `Corrupt compare function for '${comp.id}' returned '${comparison}'.`
        );
      }
      throw new Error(
        `Corrupt serach state: left=${resultRange[0]}, right=${resultRange[1]}, middle=${middleIndex}`
      );
    };
  };
}

export function findBinary<C extends Comparison<any, any>>(comp: C) {
  const compSet = findClosestIndex(comp);
  return (arr: SortedArray<C>) => {
    const findIndex = compSet(arr);
    return (element: GetComparisonType<C>): number | null => {
      const result = findIndex(element);
      if (result === null) return null;
      const [i, _] = result;
      if (comp.compare(arr[i], element) === "left=right") {
        return i;
      }
      return null;
    };
  };
}

export function DefaultAsc<T extends number | string | bigint>(): Comparison<
  T,
  "Default Ascending"
> {
  return {
    compare(left: T, right: T) {
      if (left < right) {
        return "left<right";
      }
      if (left > right) {
        return "left>right";
      }
      return "left=right";
    },
    id: "Default Ascending",
  };
}
export type DefaultAsc<
  T extends number | string | bigint = number | string | bigint
> = Comparison<T, "Default Ascending">;
