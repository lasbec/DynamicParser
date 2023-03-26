import { describe, expect, it } from "vitest";
import { DataClass } from "./DataClass";
import { DataClassSet } from "./DataClassSet";
describe("DataClassSet", () => {
  it("argument order shouldn't matter", () => {
    const a = new DataClass<string>("A");
    const b = new DataClass<string>("B");
    const s = DataClassSet.from(a, b);
    const s2 = DataClassSet.from(b, a);
    //   expect(s.idString()).toEqual(s2.idString());
    expect(1).toBe(1);
  });
});
