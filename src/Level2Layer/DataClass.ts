import { isArray, isPrimitive } from "../Level0Layer/Basics";
import { SaveJson, Json, asSaveJson, JsonPrimitive } from "../Level0Layer/Json";
import { eq as jsonEq, stringify } from "../Level0Layer/Json";
import { mapVal } from "../Level0Layer/Record";

type Data = DataObject | DataArray | DataClass | JsonPrimitive;
type DataObject = { readonly [key in string]?: Data };
type DataArray = ReadonlyArray<Data>;

export class DataClass {
  constructor(readonly data: Data) {}
  readonly json = DataClass.toJson(this.data);

  static toJson(data: Data): SaveJson {
    if (isArray(data)) {
      return data.map((e) => DataClass.toJson(e));
    }
    if (data instanceof DataClass) {
      return data.json;
    }
    if (isPrimitive(data)) {
      return data;
    }
    return mapVal(data, (_, v) => {
      return v ? DataClass.toJson(v) : undefined;
    });
  }

  eq(other: DataClass) {
    return jsonEq(this.json, other.json);
  }
  idString() {
    return stringify(this.json);
  }
}
