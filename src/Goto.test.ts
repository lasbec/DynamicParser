import { Element } from "./Grammar";
import { LR0Element } from "./LR0";
import { DataClassSet } from "./Level2Layer/DataClassSet";
import { describe, it, expect } from "vitest";
export function Goto(state: DataClassSet<LR0Element>, symb: Element) {
  //   return state.findAll((lr0) => lr0.symbolRightFromPoint()?.eq(symb));
}

describe("Goto", () => {
  it("0", () => {
    expect(0).toEqual(0);
  });
});
