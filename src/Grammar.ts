import { getRandomInt } from "./Basics";
import { Char } from "./Char";

export const EOF = Symbol("End Of File");
export type EOF = typeof EOF;

export type Terminal = Char | EOF;
export type Grammar = ReadonlyArray<Production>;
export type MetaSymbol = string;
export type Production = {
  readonly left: MetaSymbol;
  readonly right: ReadonlyArray<string>;
};

function getRandomProduction(left: string, grammar: Grammar): Production {
  const candidates = grammar.filter((p) => p.left === left);
  if (candidates.length === 0)
    throw new Error(`No productions for '${left}' in grammar.`);
  const index = getRandomInt(0, candidates.length - 1);
  const result = candidates[index];
  if (!result)
    throw new Error(
      `Invalid result! Candidates= [${candidates
        .flatMap((c) => c.left + "::=" + c.right.join(""))
        .join(",")}]; index= ${index}.`
    );
  return result;
}

function getMetaSymbols(grammar: Grammar): Set<string> {
  return new Set(grammar.map((p) => p.left));
}

function isMetaSymbol(str: string, grammar: Grammar): boolean {
  return getMetaSymbols(grammar).has(str);
}

type Element =
  | string
  | {
      r: string;
    };

function randomStep(state: Element[], grammar: Grammar): Element[] {
  const metaSymbolIndex = state.findIndex((e) => typeof e !== "string");
  const prev = state.slice(0, metaSymbolIndex);
  const metaSymbol = state[metaSymbolIndex];
  if (typeof metaSymbol === "string") throw new Error("tiaronirtan");

  const rest = state.slice(metaSymbolIndex + 1);

  const production = getRandomProduction(metaSymbol.r, grammar);
  const metaSymbolReplacement = production.right.map((s) =>
    isMetaSymbol(s, grammar) ? { r: s } : s
  );
  return [...prev, ...metaSymbolReplacement, ...rest];
}

export function generateRandomWord(
  state: { r: string },
  grammar: Grammar
): string {
  let result: Element[] = [state];
  while (result.some((e) => typeof e !== "string")) {
    result = randomStep(result, grammar);
  }
  return result.join("");
}