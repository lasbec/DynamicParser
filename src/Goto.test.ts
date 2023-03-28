import { MetaSymbol, T } from "./Grammar";
import { LR0Element } from "./LR0";
import { DataClassSet } from "./Level2Layer/DataClassSet";
import { describe, it, expect } from "vitest";
import { buildGoto0 } from "./Goto";
describe("Goto", () => {
  const A = new MetaSymbol("A");
  const S = new MetaSymbol("S");
  const Z = new MetaSymbol("Z");
  const grammar = [
    { metaSymbol: Z, result: [S] },
    { metaSymbol: S, result: [S, T("b")] },
    { metaSymbol: S, result: [T("b"), A, T("a")] },
    { metaSymbol: A, result: [T("a"), S, T("c")] },
    { metaSymbol: A, result: [T("a")] },
    { metaSymbol: A, result: [T("a"), S, T("b")] },
  ];

  it("example form paper", () => {
    const input = DataClassSet.from(
      new LR0Element({ metaSymbol: Z, result: [S] }),
      new LR0Element({ metaSymbol: S, result: [S, T("b")] }),
      new LR0Element({ metaSymbol: S, result: [T("b"), A, T("a")] })
    );
    const expected = DataClassSet.from(
      new LR0Element({ metaSymbol: S, result: [T("b"), A, T("a")] }, 1),
      new LR0Element({ metaSymbol: A, result: [T("a"), S, T("c")] }),
      new LR0Element({ metaSymbol: A, result: [T("a")] }),
      new LR0Element({ metaSymbol: A, result: [T("a"), S, T("b")] })
    );
    expect(buildGoto0(grammar, input, T("b")).eq(expected)).toEqual(true);
  });
});
