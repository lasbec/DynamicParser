import { o } from "vitest/dist/types-5872e574";
import { SaveJson } from "../Level0Layer/Json";
import { stringify } from "../Level0Layer/Json";
import {
  SortedArray,
  DefaultAsc,
  emptyArray,
  insertBinary,
} from "../Level0Layer/SortedArray";
import { DataClass } from "./DataClass";

export class DataClassSet<T extends DataClass> {
  private constructor(
    private readonly _map: ReadonlyMap<string, T>,
    private readonly sortedKeys: SortedArray<DefaultAsc<string>>
  ) {}
  readonly length = this.sortedKeys.length;
  idString(): string {
    return stringify(this.sortedKeys);
  }

  eq(other: DataClassSet<T>): boolean {
    return this.idString() === other.idString();
  }

  neq(other: DataClassSet<T>): boolean {
    return !this.eq(other);
  }

  static from<T extends DataClass>(...elements: ReadonlyArray<T>) {
    let result = DataClassSet.empty<T>();
    for (const el of elements) {
      result = result.add(el);
    }
    return result;
  }

  static empty<T extends DataClass>() {
    return new DataClassSet<T>(new Map(), emptyArray(DefaultAsc<string>()));
  }

  find(predicate: (el: T) => boolean): T | null {
    for (const val of this._map.values()) {
      if (predicate(val)) return val;
    }
    return null;
  }

  findAll(predicate: (el: T) => boolean): DataClassSet<T> {
    let result = DataClassSet.empty<T>();
    for (const val of this._map.values()) {
      if (predicate(val)) {
        result = result.add(val);
      }
    }
    return result;
  }

  has(el: T | ((e: T) => boolean)): boolean {
    if (typeof el === "function") {
      return !!this.find(el);
    }
    return this._map.has(el.idString());
  }

  add(...els: T[]): DataClassSet<T> {
    let result: DataClassSet<T> = this;
    for (const e of els) {
      result = result.addOneElement(e);
    }
    return result;
  }

  private addOneElement(el: T): DataClassSet<T> {
    const newMap = new Map(this._map);
    newMap.set(el.idString(), el);
    const newKeys = this._map.has(el.idString())
      ? this.sortedKeys
      : insertBinary(DefaultAsc<string>())(this.sortedKeys)(el.idString());
    return new DataClassSet(newMap, newKeys);
  }
}
