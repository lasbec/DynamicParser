import { describe, expect, it } from "vitest";
import { Escaper } from "./Level1Layer/Escaper";
import { Char } from "./Level0Layer/Char";

describe("Escaper", () => {
  const e = Escaper({ escapeChar: Char("$") });
  it("should escape", () => {
    expect(e.escape("ABC$EFG <$>")).toEqual("ABC$$EFG <$$>");
  });
  it("should unescape", () => {
    expect(e.unescape("ABC$$EFG <$$>")).toEqual("ABC$EFG <$>");
  });
  it("should recognize escaped string", () => {
    expect(e.isEscaped("ABC$$EFG <$$>")).toEqual(true);
  });
  it("should recognize unescaped string", () => {
    expect(e.isEscaped("ABC$$EFG <$>")).toEqual(false);
  });

  it("0", () => {
    expect(e.splitOnUnescaped("ABC$EFG <$$>")).toEqual(["ABC", "EFG <$$>"]);
  });
});
