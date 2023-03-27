import { Grammar } from "./Grammar";
import { DataClassSet } from "./Level2Layer/DataClassSet";
import { LR0Element } from "./LR0";

export function buildClosure0(
  grammar: Grammar,
  elements: DataClassSet<LR0Element>
): DataClassSet<LR0Element> {
  let result = elements;
  let candidates = getCandidates();
  let newResult = result.add(...candidates);
  while (result.neq(newResult)) {
    result = newResult;
    candidates = getCandidates();
    newResult = result.add(...candidates);
  }
  return newResult;

  function getCandidates(): LR0Element[] {
    return grammar
      .filter((prod) =>
        result.has(
          (lr0) => !!lr0.metaSymbolToTheRightFromPoint()?.eq(prod.metaSymbol)
        )
      )
      .map((prod) => new LR0Element(prod));
  }
}
