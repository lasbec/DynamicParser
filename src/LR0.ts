import { Production, Element, MetaSymbol } from "./Grammar";
import { DataClass } from "./Level2Layer/DataClass";
import { N } from "vitest/dist/types-5872e574";

export class LR0Element extends DataClass implements Production {
  constructor(
    readonly production: Production,
    readonly pointIndex: number = 0
  ) {
    super({
      ...production,
      pointIndex,
    });
  }
  readonly metaSymbol = this.production.metaSymbol;
  readonly result = this.production.result;

  symbolRightFromPoint(): Element | null {
    return this.rightFromPoint()[0];
  }

  metaSymbolToTheRightFromPoint(): MetaSymbol | null {
    const candidate = this.symbolRightFromPoint();
    return candidate instanceof MetaSymbol ? candidate : null;
  }

  leftFromPoint(): ReadonlyArray<Element> {
    return this.result.slice(0, this.pointIndex);
  }
  rightFromPoint(): ReadonlyArray<Element> {
    return this.result.slice(this.pointIndex);
  }
}
