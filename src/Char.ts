export type Char = string & { lenght: 1 };

export function isChar(str: string): str is Char {
  return str.length === 1;
}

export function assertChar(str: string): asserts str is Char {
  if (!isChar(str))
    throw new Error(`Expected '${str}' to be a single character.`);
}

export function Char(str: string): Char {
  assertChar(str);
  return str;
}

export function charAt(str: string, index: number) {
  return str.at(index) as Char | undefined;
}
