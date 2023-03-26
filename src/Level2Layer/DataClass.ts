import { SaveJson } from "../Level0Layer/Json";
import { eq as jsonEq, stringify } from "../Level0Layer/Json";

export class DataClass<Data extends SaveJson> {
  constructor(readonly data: Data) {}
  eq(other: DataClass<Data>) {
    return jsonEq(this.data, other.data);
  }
  idString() {
    return stringify(this.data);
  }
}
