import { SaveJson } from "../Level0Layer/Json";
import { eq as jsonEq, stringify } from "../Level0Layer/Json";

export abstract class DataClass<Data extends SaveJson> {
  constructor(readonly data: Data) {}
  eq(other: DataClass<Data>) {
    return jsonEq(this.data, other.data);
  }
  idString() {
    return stringify(this.data);
  }
}

export class DataClassSet<Data extends SaveJson> {
  private constructor(
    private readonly _map: ReadonlyMap<string, DataClass<Data>>,
    private readonly sortedKeys: ReadonlyArray<string>
  ) {}
  idString() {
    return stringify(this.sortedKeys);
  }

  static from<Data extends SaveJson>(
    ...elements: ReadonlyArray<DataClass<Data>>
  ) {
    let result = DataClassSet.empty<Data>();
    for (const el of elements) {
      result = result.add(el);
    }
    return result;
  }

  static empty<Data extends SaveJson>() {
    return new DataClassSet<Data>(new Map(), []);
  }

  has(el: DataClass<Data>) {
    return this._map.has(el.idString());
  }

  add(el: DataClass<Data>) {
    const newMap = new Map(this._map);
    newMap.set(el.idString(), el);
    return new DataClassSet(newMap, []);
  }
}
