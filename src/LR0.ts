import { Production, ProductionElement, MetaSymbol } from "./Grammar";
import { DataClass } from "./Level2Layer/DataClass";

export class LR0Element extends DataClass<LR0Element> implements Production {
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

  symbolRightFromPoint(): ProductionElement | null {
    return this.rightFromPoint()[0];
  }

  shiftPointOneRight(): LR0Element {
    return new LR0Element(this.production, this.pointIndex + 1);
  }

  static shiftPointOneRight(lr0: LR0Element): LR0Element {
    return lr0.shiftPointOneRight();
  }

  metaSymbolToTheRightFromPoint(): MetaSymbol | null {
    const candidate = this.symbolRightFromPoint();
    return candidate instanceof MetaSymbol ? candidate : null;
  }

  leftFromPoint(): ReadonlyArray<ProductionElement> {
    return this.result.slice(0, this.pointIndex);
  }
  rightFromPoint(): ReadonlyArray<ProductionElement> {
    return this.result.slice(this.pointIndex);
  }
}
