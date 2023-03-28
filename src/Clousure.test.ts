import { describe, expect, it } from "vitest";
import { Char } from "./Level0Layer/Char";
import {
  MetaSymbol,
  getProductionsWithMetaSymbol,
  Grammar,
  T,
} from "./Grammar";
import { DataClassSet } from "./Level2Layer/DataClassSet";
import { LR0Element } from "./LR0";
import { buildClosure0 } from "./Clousure";

describe("Clouser", () => {
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
  it("simple example", () => {
    const startLr0 = new LR0Element({ metaSymbol: Z, result: [S] });
    const inputSet = DataClassSet.from(startLr0);
    const expected = DataClassSet.from(
      startLr0,
      new LR0Element({ metaSymbol: S, result: [S, T("b")] }),
      new LR0Element({ metaSymbol: S, result: [T("b"), A, T("a")] })
    );
    expect(buildClosure0(grammar, inputSet).eq(expected)).toBeTruthy();
  });
});
