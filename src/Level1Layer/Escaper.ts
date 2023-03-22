import { Char } from "../Level0Layer/Char";

export interface EscapeConfig {
  readonly escapeChar: Char;
}
export type EscapedString<Config extends EscapeConfig> = string & Config;
export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function Escaper<Config extends EscapeConfig>(config: Config) {
  const { escapeChar } = config;
  return {
    escape: (str: string) => {
      let result = "";
      for (const char of str) {
        if (char === escapeChar) {
          result += escapeChar + escapeChar;
        } else {
          result += char;
        }
      }
      return result;
    },
    unescape: (str: string): string => {
      let result = "";
      let escapeCharSeen = false;
      for (const char of str) {
        if (escapeCharSeen) {
          escapeCharSeen = false;
          result += char;
        } else if (char === escapeChar) {
          escapeCharSeen = true;
        } else {
          result += char;
        }
      }
      return result;
    },
    isEscaped(str: string): str is EscapedString<Config> {
      let escapeCharSeenInARow = 0;
      for (const char of str) {
        if (char === escapeChar) {
          escapeCharSeenInARow += 1;
        } else if (escapeCharSeenInARow % 2 !== 0) {
          return false;
        }
      }
      return true;
    },
  };
}
