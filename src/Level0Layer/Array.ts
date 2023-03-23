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
  const compSet = findClosestIntexBinary(comp);
  return (arr: SortedArray<C>) => {
    const findIndex = compSet(arr);
    return (element: GetComparisonType<C>): SortedArray<C> => {
      const i = findIndex(element);
      if (i === null) return [element] as unknown as SortedArray<C>;
      return [
        ...arr.slice(0, i),
        element,
        ...arr.slice(i),
      ] as unknown as SortedArray<C>;
    };
  };
}

export function findClosestIntexBinary<C extends Comparison<any, any>>(
  comp: C
) {
  return (arr: SortedArray<C>) => {
    return (element: GetComparisonType<C>): number | null => {
      if (arr.length === 0) {
        return null;
      }
      if (arr.length === 1) {
        return comp.compare(arr[0], element) === "left=right" ? 0 : null;
      }
      const resultRange: [number, number] = [0, arr.length - 1];
      let middleIndex = Math.floor(resultRange[0] + resultRange[1] / 2);
      while (resultRange[0] < resultRange[1]) {
        middleIndex = Math.floor((resultRange[0] + resultRange[1]) / 2);
        const comparison = comp.compare(arr[middleIndex], element);
        if (comparison === "left=right") {
          return middleIndex;
        }
        if (middleIndex === resultRange[0] || middleIndex === resultRange[1]) {
          return comp.compare(arr[resultRange[1]], element) === "left=right"
            ? resultRange[1]
            : resultRange[0];
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
  const compSet = findClosestIntexBinary(comp);
  return (arr: SortedArray<C>) => {
    const findIndex = compSet(arr);
    return (element: GetComparisonType<C>): number | null => {
      const i = findIndex(element);
      if (i === null) return null;
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
