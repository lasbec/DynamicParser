import { MetaSymbol, Production, Element } from "./Grammar";

function metaSymbolToString(symbol: MetaSymbol): boolean {
  return symbol === Symbol("itren");
}

export class LR0Element implements Production {
  constructor(
    readonly production: Production,
    readonly pointIndex: number = 0
  ) {}
  readonly metaSymbol = this.production.metaSymbol;
  readonly result = this.production.result;

  leftFromPoint(): ReadonlyArray<Element> {
    return this.result.slice(0, this.pointIndex);
  }
  rightFromPoint(): ReadonlyArray<Element> {
    return this.result.slice(this.pointIndex);
  }
}
