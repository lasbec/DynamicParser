import { getRandomInt, Primitive, isPrimitive } from "./Level0Layer/Basics";
import { Char } from "./Level0Layer/Char";
import { DataClass } from "./Level2Layer/DataClass";

export const EOF = {
  end_of_file: true,
};
export type EOF = typeof EOF;
export function isEOF(x: Primitive | Record<string, any>): x is EOF {
  return (
    !isPrimitive(x) && Object.keys(x).length === 1 && x["end_of_file"] === true
  );
}

export type Terminal = Char | EOF;
export class MetaSymbol extends DataClass {
  constructor(readonly name: string) {
    super({ name });
  }

  toString() {
    return this.name;
  }
}
export type Element = Terminal | MetaSymbol;
export type Grammar = ReadonlyArray<Production>;
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

function randomStep(state: Element[], grammar: Grammar): Element[] {
  const metaSymbolIndex = state.findIndex((e) => e instanceof MetaSymbol);
  const prev = state.slice(0, metaSymbolIndex);
  const metaSymbol = state[metaSymbolIndex];
  if (!(metaSymbol instanceof MetaSymbol)) throw new Error("tiaronirtan");

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
