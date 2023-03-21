import { R } from "vitest/dist/types-5872e574";
import { Primitive } from "./Basics";

export class Table<
  Entry,
  ColumnKey extends Primitive = string,
  RowKey extends Primitive = number
> {
  private constructor(
    readonly map: ReadonlyMap<ColumnKey, ReadonlyMap<RowKey, Entry>>
  ) {}
  static empty<
    Entry,
    ColumnKey extends Primitive = string,
    RowKey extends Primitive = number
  >(): Table<Entry, ColumnKey, RowKey> {
    return new Table(new Map());
  }

  set(
    col: ColumnKey,
    row: RowKey,
    action: Entry
  ): Table<Entry, ColumnKey, RowKey> {
    const newStateMap = new Map(this.map.get(col) || new Map());
    newStateMap.set(row, action);

    const newMap = new Map(this.map);
    newMap.set(col, newStateMap);

    return new Table(newMap);
  }

  setRow(rowKey: RowKey, row: [ColumnKey, Entry][]) {
    let result: Table<Entry, ColumnKey, RowKey> = this;
    for (const [colKey, entry] of row) {
      result = result.set(colKey, rowKey, entry);
    }
    return result;
  }

  get(col: ColumnKey, row: RowKey): Entry | undefined {
    return this.map.get(col)?.get(row);
  }
}
