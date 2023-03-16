import { describe, expect, it } from "vitest";
import { DynamicParser, R } from "./DynamicParser";
describe("DynamicParser", () => {
  it("constructor types", () => {
    //@ts-expect-error
    new DynamicParser<"A" | "B">({
      A: [[R("B"), "terminal"]],
    });
    new DynamicParser<"A" | "B">({
      A: [[R("B"), "terminal"]],
      B: [["hallo"]],
    });
  });
  it("a", () => {
    expect(1).toEqual(1);
  });
});
