import { describe, expect, it } from "vitest";
import { Table } from "./Table";

export type Production = {
  readonly left: string;
  readonly right: ReadonlyArray<string>;
};
export type Grammar = ReadonlyArray<Production>;

export class ShiftReduceMachine {
  constructor(
    readonly actions: Table<Action, Terminal>,
    readonly jumpingTable: Table<number>,
    readonly grammar: Grammar
  ) {}

  run(input: string): "accept" | "reject" {
    const execution = new ShiftReduceExecution(
      this.actions,
      this.jumpingTable,
      this.grammar
    );
    return execution.run(input);
  }
}

class ShiftReduceExecution extends ShiftReduceMachine {
  private input: string = "";
  private state: number | "accept" | "reject" = 0;
  private stack: [Terminal, number][] = [["", 0]];

  private init(input: string) {
    this.input = input;
    this.state = 0;
    this.stack = [["", 0]];
  }

  private peekStack() {
    return this.stack[this.stack.length - 1];
  }

  private peekChar(): Terminal {
    return this.input[0] || EOF;
  }
  private consumeChar(): Terminal {
    const result = this.peekChar();
    this.input = this.input.slice(1);
    return result;
  }

  private execute(action: Action): void {
    switch (action.type) {
      case "shift":
        this.shift(action.nextState);
        break;
      case "reduce":
        this.reduce(action.ruleIndex);
        break;
      case "accept":
        this.accept();
        break;
      case "reject":
        this.reject();
        break;
    }
  }

  private shift(nextState: number) {
    const c = this.consumeChar();
    this.stack.push([c, nextState]);
    this.state = nextState;
  }

  private reduce(ruleIndex: number) {
    const production = this.grammar[ruleIndex];
    if (!production) throw new Error(`Invalid production index ${ruleIndex}`);
    const l = production.right.length;
    this.stack.splice(-l);
    const top = this.peekStack();
    const readState = top[1];
    const newState = this.jumpingTable.get(production.left, readState);
    if (!newState) {
      this.reject();
      return;
    }
    this.state = newState;
    this.stack.push([production.left, newState]);
  }

  private accept() {
    this.state = "accept";
  }

  private reject() {
    this.state = "reject";
  }

  run(input: string): "accept" | "reject" {
    this.input = input;
    while (typeof this.state !== "string") {
      const char = this.peekChar();
      const action = this.actions.get(char, this.state) || reject();
      this.execute(action);
    }
    return this.state;
  }
}

export type Action =
  | {
      readonly type: "shift";
      readonly nextState: number;
    }
  | {
      readonly type: "reduce";
      readonly ruleIndex: number;
    }
  | {
      readonly type: "accept" | "reject";
    };

function shift(nextState: number): Action {
  return {
    type: "shift",
    nextState,
  };
}

function reduce(ruleIndex: number): Action {
  return {
    type: "reduce",
    ruleIndex,
  };
}

function accept(): Action {
  return {
    type: "accept",
  };
}
export function reject(): Action {
  return {
    type: "reject",
  };
}

export type Terminal = string | EOF;

const EOF = Symbol("End Of File");
type EOF = typeof EOF;

/*
 * Example Grammar:
 *0 Z ::= S
 *1 S ::= Sb
 *2 S ::= bAa
 *3 A ::= aSc
 *4 A ::= a
 *5 A ::= aSb
 */

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomProduction(left: string, grammar: Grammar): Production {
  const candidates = grammar.filter((p) => p.left === left);
  if (candidates.length === 0)
    throw new Error(`No productions for '${left}' in grammar.`);
  const index = getRandomInt(0, candidates.length - 1);
  const result = candidates[index];
  if (!result)
    throw new Error(
      `Invalid result! Candidates= [${candidates
        .flatMap((c) => c.left + "::=" + c.right.join(""))
        .join(",")}]; index= ${index}.`
    );
  return result;
}

function getMetaSymbols(grammar: Grammar): Set<string> {
  return new Set(grammar.map((p) => p.left));
}

function isMetaSymbol(str: string, grammar: Grammar): boolean {
  return getMetaSymbols(grammar).has(str);
}

type Element =
  | string
  | {
      r: string;
    };

function randomStep(state: Element[], grammar: Grammar): Element[] {
  const metaSymbolIndex = state.findIndex((e) => typeof e !== "string");
  const prev = state.slice(0, metaSymbolIndex);
  const metaSymbol = state[metaSymbolIndex];
  if (typeof metaSymbol === "string") throw new Error("tiaronirtan");

  const rest = state.slice(metaSymbolIndex + 1);

  const production = getRandomProduction(metaSymbol.r, grammar);
  const metaSymbolReplacement = production.right.map((s) =>
    isMetaSymbol(s, grammar) ? { r: s } : s
  );
  return [...prev, ...metaSymbolReplacement, ...rest];
}

function generateRandomWord(state: { r: string }, grammar: Grammar): string {
  let result: Element[] = [state];
  while (result.some((e) => typeof e !== "string")) {
    result = randomStep(result, grammar);
  }
  return result.join("");
}

describe("ByScript", () => {
  const actionTable = Table.empty<Action, Terminal>()
    .setRow(0, [["b", shift(3)]])
    .setRow(1, [
      ["b", shift(2)],
      [EOF, accept()],
    ])
    .setRow(2, [
      ["b", reduce(1)],
      [EOF, reduce(1)],
    ])
    .setRow(3, [["a", shift(6)]])
    .setRow(4, [["a", shift(5)]])
    .setRow(5, [
      ["b", reduce(2)],
      ["c", reduce(2)],
      [EOF, reduce(2)],
    ])
    .setRow(6, [
      ["a", reduce(4)],
      ["b", shift(3)],
    ])
    .setRow(7, [
      ["b", shift(9)],
      ["c", shift(8)],
    ])
    .setRow(8, [["a", reduce(4)]])
    .setRow(9, [
      ["a", reduce(5)],
      ["b", reduce(1)],
      ["c", reduce(1)],
      [EOF, reduce(1)],
    ]);

  const jumpingTable = Table.empty<number>()
    .set("A", 3, 4)
    .set("S", 0, 1)
    .set("S", 6, 7);

  const grammar = [
    { left: "Z", right: ["S"] },
    { left: "S", right: ["S", "b"] },
    { left: "S", right: ["b", "A", "a"] },
    { left: "A", right: ["a", "S", "c"] },
    { left: "A", right: ["a"] },
    { left: "A", right: ["a", "S", "b"] },
  ];
  const srm = new ShiftReduceMachine(actionTable, jumpingTable, grammar);
  describe("accept and reject words", () => {
    const wordsToExecpt = ["baab", "baabb"];
    for (const word of wordsToExecpt) {
      it(word, () => {
        if (srm.run(word) !== "accept") {
          expect(word).toEqual({ toBe: "accepted" });
        }
      });
    }

    const wordsToRejected = ["xyb", "", "babab", "babaacab"];
    for (const word of wordsToRejected) {
      it(word, () => {
        if (srm.run(word) !== "reject") {
          expect(word).toEqual({ toBe: "reject" });
        }
      });
    }
  });

  //   describe("property testing", () => {
  //     for (const i of Array(5).map((_, i) => i)) {
  //       it(`${i}: generated word should be accepted.`, () => {
  //         const word = generateRandomWord({ r: "Z" }, grammar);
  //         if (srm.run(word) === "reject") {
  //           expect(word).toEqual("");
  //         }
  //       });
  //     }
  //   });
});
