import { Table } from "./Table";
import { Grammar, MetaSymbol } from "./Grammar";
import { Char, at as charAt } from "./Char";

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
  private stack: [Terminal | MetaSymbol, number][] = [["", 0]];

  private init(input: string) {
    this.input = input;
    this.state = 0;
    this.stack = [["", 0]];
  }

  private peekStack() {
    return this.stack[this.stack.length - 1];
  }

  private peekChar(): Terminal {
    return charAt(this.input, 0) || EOF;
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

export function shift(nextState: number): Action {
  return {
    type: "shift",
    nextState,
  };
}

export function reduce(ruleIndex: number): Action {
  return {
    type: "reduce",
    ruleIndex,
  };
}

export function accept(): Action {
  return {
    type: "accept",
  };
}
export function reject(): Action {
  return {
    type: "reject",
  };
}

export type Terminal = Char | EOF;

export const EOF = Symbol("End Of File");
export type EOF = typeof EOF;
