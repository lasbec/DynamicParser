import { MetaSymbol, Production, Element } from "./Grammar";
import { Json, StableJsonString } from "./Level0Layer/Json";
import { DataClassSet } from "./Level2Layer/DataClassSet";
import { DataClass } from "./Level2Layer/DataClass";

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

  leftFromPoint(): ReadonlyArray<Element> {
    return this.result.slice(0, this.pointIndex);
  }
  rightFromPoint(): ReadonlyArray<Element> {
    return this.result.slice(this.pointIndex);
  }
}
