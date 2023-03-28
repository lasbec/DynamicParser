import { getRandomInt, Primitive, isPrimitive } from "./Level0Layer/Basics";
import { Char } from "./Level0Layer/Char";
import { DataClass } from "./Level2Layer/DataClass";
import { DataClassSet } from "./Level2Layer/DataClassSet";

export abstract class ProductionElement extends DataClass<ProductionElement> {}

export class Terminal extends ProductionElement {
  constructor(readonly id?: Char) {
    super(id || { end_of_file: true });
  }

  isEOF(): this is Terminal & { id: undefined } {
    return this.id === undefined;
  }
}
export function T(s?: string): Terminal {
  return new Terminal(typeof s === "string" ? Char(s) : s);
}
export const EOF = T();

export class MetaSymbol extends ProductionElement {
  constructor(readonly name: string) {
    super({ name });
  }

  toString() {
    return this.name;
  }
}
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

export function getProductionsWithMetaSymbol(
  grammar: Grammar,
  metaSymbol: MetaSymbol
): Production[] {
  return grammar.filter((prod) => prod.metaSymbol.eq(metaSymbol));
}

function randomStep(
  state: ProductionElement[],
  grammar: Grammar
): ProductionElement[] {
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
  let result: ProductionElement[] = [state];
  while (result.some((e) => typeof e !== "string")) {
    result = randomStep(result, grammar);
  }
  return result.join("");
}
