import { getRandomInt } from "./Level0Layer/Basics";
import { Char } from "./Level0Layer/Char";

export const EOF = Symbol("End Of File");
export type EOF = typeof EOF;

export type Terminal = Char | EOF;
export type Grammar = ReadonlyArray<Production>;
export type MetaSymbol = symbol;
export type Production = {
  readonly metaSymbol: MetaSymbol;
  readonly result: ReadonlyArray<Terminal | MetaSymbol>;
};

function getRandomProduction(left: MetaSymbol, grammar: Grammar): Production {
  const candidates = grammar.filter((p) => p.metaSymbol === left);
  if (candidates.length === 0)
    throw new Error(`No productions for '${String(left)}' in grammar.`);
  const index = getRandomInt(0, candidates.length - 1);
  const result = candidates[index];
  if (!result)
    throw new Error(
      `Invalid result! Candidates= [${candidates
        .flatMap((c) => c.metaSymbol.toString() + "::=" + c.result.join(""))
        .join(",")}]; index= ${index}.`
    );
  return result;
}

function getMetaSymbols(grammar: Grammar): Set<MetaSymbol> {
  return new Set(grammar.map((p) => p.metaSymbol));
}

function isMetaSymbol(str: string, grammar: Grammar): boolean {
  return getMetaSymbols(grammar).has(Symbol(str));
}

type Element = Terminal | MetaSymbol;

function randomStep(state: Element[], grammar: Grammar): Element[] {
  const metaSymbolIndex = state.findIndex((e) => typeof e !== "string");
  const prev = state.slice(0, metaSymbolIndex);
  const metaSymbol = state[metaSymbolIndex];
  if (typeof metaSymbol === "string") throw new Error("tiaronirtan");

  const rest = state.slice(metaSymbolIndex + 1);

  const production = getRandomProduction(metaSymbol, grammar);
  const metaSymbolReplacement = production.result;
  return [...prev, ...metaSymbolReplacement, ...rest];
}

export function generateRandomWord(
  state: MetaSymbol,
  grammar: Grammar
): string {
  let result: Element[] = [state];
  while (result.some((e) => typeof e !== "string")) {
    result = randomStep(result, grammar);
  }
  return result.join("");
}
