import { describe, expect, it } from "vitest";
import { Char } from "./Level0Layer/Char";
import { MetaSymbol, getProductionsWithMetaSymbol, Grammar } from "./Grammar";
import { DataClassSet } from "./Level2Layer/DataClassSet";
import { LR0Element } from "./LR0";
import { buildClosure0 } from "./Clousure";

describe("Clouser", () => {
  const A = new MetaSymbol("A");
  const S = new MetaSymbol("S");
  const Z = new MetaSymbol("Z");
  const grammar = [
    { metaSymbol: Z, result: [S] },
    { metaSymbol: S, result: [S, Char("b")] },
    { metaSymbol: S, result: [Char("b"), A, Char("a")] },
    { metaSymbol: A, result: [Char("a"), S, Char("c")] },
    { metaSymbol: A, result: [Char("a")] },
    { metaSymbol: A, result: [Char("a"), S, Char("b")] },
  ];
  it("simple example", () => {
    const startLr0 = new LR0Element({ metaSymbol: Z, result: [S] });
    const inputSet = DataClassSet.from(startLr0);
    const expected = DataClassSet.from(
      startLr0,
      new LR0Element({ metaSymbol: S, result: [S, Char("b")] }),
      new LR0Element({ metaSymbol: S, result: [Char("b"), A, Char("a")] })
    );
    expect(buildClosure0(grammar, inputSet).eq(expected)).toBeTruthy();
  });
});
