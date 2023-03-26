import stableStringify from "json-stable-stringify";

export type Json = JsonObject | JsonArray;
export type JsonObject = { readonly [key in string]?: Json | JsonPrimitive };
export type JsonArray = ReadonlyArray<Json | JsonPrimitive>;
export type JsonPrimitive = number | string | null | boolean;

export type MutJson = MutJsonObject | MutJsonArray;
export type MutJsonObject = { [key in string]?: MutJson | JsonPrimitive };
export type MutJsonArray = Array<MutJson | JsonPrimitive>;

export type JsonString = string & { __json__: true };
export type StableJsonString = string & { __json__: true; __stable__: true };

export type SaveJson =
  | (Json & "SaveJson")
  | JsonPrimitive
  | ReadonlyArray<JsonPrimitive>;

export function isSaveJson(json: Json | JsonPrimitive): json is SaveJson {
  try {
    stableStringify(json);
    return true;
  } catch (e) {
    return false;
  }
}

export function assertSaveJson(
  json: Json | JsonPrimitive,
  errMsg?: string
): asserts json is SaveJson {
  if (!isSaveJson)
    throw new Error(errMsg || "Expected JSON to be save for stringification.");
}

export function asSaveJson(
  json: Json | JsonPrimitive,
  errMsg?: string
): SaveJson {
  assertSaveJson(json, errMsg);
  return json;
}

export function stringify(json: SaveJson | JsonPrimitive): StableJsonString;
export function stringify(json: Json | JsonPrimitive): StableJsonString | Error;
export function stringify(
  json: Json | JsonPrimitive
): StableJsonString | Error {
  try {
    return stableStringify(json) as StableJsonString;
  } catch (e) {
    if (e instanceof Error) return e;
    return new Error(`${e}`);
  }
}

/**
 * Recursive JSONs are not compareable jet.
 * @param json0
 * @param json1
 * @returns
 */
export function eq(
  json0: SaveJson | JsonPrimitive,
  json1: SaveJson | JsonPrimitive
): boolean {
  return stringify(json0) === stringify(json1);
}

export function parseJson(
  str: JsonString,
  mutalble: "mut"
): MutJson | JsonPrimitive;
export function parseJson(
  str: string,
  mutable: "mut"
): MutJson | JsonPrimitive | Error;
export function parseJson(str: JsonString): Json | JsonPrimitive;
export function parseJson(str: string): Json | JsonPrimitive | Error;
export function parseJson(str: string, mutalble?: "mut") {
  try {
    return JSON.parse(str);
  } catch (e) {
    if (e instanceof Error) return e;
    return new Error(`${e}`);
  }
}
