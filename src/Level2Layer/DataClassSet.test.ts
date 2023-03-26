import { describe, expect, it } from "vitest";
import { DataClass } from "./DataClass";
import { DataClassSet } from "./DataClassSet";
import { range, randomArray, shuffle } from "../Level0Layer/Array";
import { asSaveJson } from "../Level0Layer/Json";
import { isPrimitive } from "../Level0Layer/Basics";
describe("DataClassSet", () => {
  for (const len of range(10)) {
    it("PROPERTY: argument order shouldn't matter", () => {
      const args = randomArray(len).map((n) => new DataClass(n));
      const shuffeldArgs = shuffle(args);
      const s = DataClassSet.from(...args);
      const s2 = DataClassSet.from(...shuffeldArgs);
      expect(s.eq(s2)).toBeTruthy();
    });
  }

  it("remove duplicates", () => {
    const s = DataClassSet.from(new DataClass("A"), new DataClass("A"));
    const s2 = DataClassSet.from(new DataClass("A"));
    expect(s.eq(s2)).toBeTruthy();
  });

  it("JSON duplicates", () => {
    const json1 = asSaveJson({ a: "", b: { c: {} }, d: false });
    const json2 = asSaveJson({ a: "", d: false, b: { c: {} }, x: undefined });
    const s = DataClassSet.from(new DataClass(json1), new DataClass(json2));
    const s2 = DataClassSet.from(new DataClass(json1));
    expect(s.eq(s2)).toBeTruthy();
    expect(s.length).toEqual(1);
    expect(s2.has(new DataClass(json2))).toBeTruthy();
  });
});
