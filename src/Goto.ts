import { Grammar, ProductionElement } from "./Grammar";
import { LR0Element } from "./LR0";
import { DataClassSet } from "./Level2Layer/DataClassSet";
import { buildClosure0 } from "./Clousure";

export function buildGoto0(
  grammar: Grammar,
  state: DataClassSet<LR0Element>,
  symb: ProductionElement
) {
  return buildClosure0(
    grammar,
    state
      .findAll((lr0) => lr0.symbolRightFromPoint()?.eq(symb) || false)
      .map(LR0Element.shiftPointOneRight)
  );
}
