import { describe, it } from "vitest";
import { Char } from "./Level0Layer/Char";

const A = Symbol("A");
const S = Symbol("S");
const Z = Symbol("Z");
const grammar = [
  { metaSymbol: Z, result: [S] },
  { metaSymbol: S, result: [S, Char("b")] },
  { metaSymbol: S, result: [Char("b"), A, Char("a")] },
  { metaSymbol: A, result: [Char("a"), S, Char("c")] },
  { metaSymbol: A, result: [Char("a")] },
  { metaSymbol: A, result: [Char("a"), S, Char("b")] },
];
describe("Clouser", () => {
  it("should be defined", () => {});
});
