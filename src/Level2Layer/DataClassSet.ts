import { SaveJson } from "../Level0Layer/Json";
import { stringify } from "../Level0Layer/Json";
import {
  SortedArray,
  DefaultAsc,
  emptyArray,
  insertBinary,
} from "../Level0Layer/SortedArray";
import { DataClass } from "./DataClass";

export class DataClassSet<Data extends SaveJson> {
  private constructor(
    private readonly _map: ReadonlyMap<string, DataClass>,
    private readonly sortedKeys: SortedArray<DefaultAsc<string>>
  ) {}
  readonly length = this.sortedKeys.length;
  idString(): string {
    return stringify(this.sortedKeys);
  }

  eq(other: DataClassSet<Data>): boolean {
    return this.idString() === other.idString();
  }

  static from<Data extends SaveJson>(...elements: ReadonlyArray<DataClass>) {
    let result = DataClassSet.empty<Data>();
    for (const el of elements) {
      result = result.add(el);
    }
    return result;
  }

  static empty<Data extends SaveJson>() {
    return new DataClassSet<Data>(new Map(), emptyArray(DefaultAsc<string>()));
  }

  has(el: DataClass) {
    return this._map.has(el.idString());
  }

  add(el: DataClass) {
    const newMap = new Map(this._map);
    newMap.set(el.idString(), el);
    const newKeys = this._map.has(el.idString())
      ? this.sortedKeys
      : insertBinary(DefaultAsc<string>())(this.sortedKeys)(el.idString());
    return new DataClassSet(newMap, newKeys);
  }
}
