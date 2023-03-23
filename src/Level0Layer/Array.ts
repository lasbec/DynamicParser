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

export function findBinary<C extends Comparison<any, any>>(comp: C) {
  return (arr: SortedArray<C>) => {
    return (element: GetComparisonType<C>): number | undefined => {
      const resultRange: [number, number] = [0, arr.length - 1];
      let middleIndex = Math.floor(resultRange[0] + resultRange[1] / 2);
      while (resultRange[0] < resultRange[1]) {
        middleIndex = Math.floor((resultRange[0] + resultRange[1]) / 2);
        const comparison = comp.compare(arr[middleIndex], element);
        if (comparison === "left=right") {
          return middleIndex;
        }
        if (middleIndex === resultRange[0] || middleIndex === resultRange[1]) {
          return;
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
