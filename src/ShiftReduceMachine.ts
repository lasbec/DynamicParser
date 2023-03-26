import { Table } from "./Level1Layer/Table";
import { EOF, Grammar, MetaSymbol, Terminal, isEOF } from "./Grammar";
import { charAt, Char } from "./Level0Layer/Char";
import { notNullish } from "./Level0Layer/Basics";

type Result =
  | {
      inLanguage: true;
    }
  | {
      inLanguage: false;
      reason: string;
    };

export class JumpingTable {
  static empty(): JumpingTable {
    return new JumpingTable(Table.empty());
  }

  private constructor(private table: Table<number>) {}

  set(metaSymbol: MetaSymbol, state: number, newState: number) {
    return new JumpingTable(
      this.table.set(metaSymbol.idString(), state, newState)
    );
  }

  setRow(rowKey: number, row: [MetaSymbol, number][]) {
    return new JumpingTable(
      this.table.setRow(
        rowKey,
        row.map(([ms, s]) => [ms.idString(), s])
      )
    );
  }

  get(metaSymbol: MetaSymbol, state: number) {
    return this.table.get(metaSymbol.idString(), state);
  }
}

export class ActionTable {
  private constructor(
    private table = Table.empty<Action>(),
    private eofMap = new Map<number, Action>()
  ) {}

  static empty() {
    return new ActionTable();
  }

  get(terminal: Terminal, state: number) {
    if (isEOF(terminal)) return this.eofMap.get(state);
    return this.table.get(terminal, state);
  }

  setRow(rowKey: number, row: [Terminal, Action][]) {
    const table = this.table.setRow(
      rowKey,
      row
        .map(([t, a]): [Char, Action] | null => (isEOF(t) ? null : [t, a]))
        .filter(notNullish)
    );

    const eofEntry = row.find(([t, a]) => isEOF(t));
    const eofMap = new Map(this.eofMap);
    if (eofEntry) eofMap.set(rowKey, eofEntry[1]);
    return new ActionTable(table, eofMap);
  }
}

export class ShiftReduceMachine {
  constructor(
    readonly actions: ActionTable,
    readonly jumpingTable: JumpingTable,
    readonly grammar: Grammar
  ) {}

  run(input: string): Result {
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
  private state: number | Result = 0;
  private stack: [Terminal | MetaSymbol, number][] = [[EOF, 0]];
  private charCounter = 0;
  private lineCounter = 0;

  private init(input: string) {
    this.input = input;
    this.state = 0;
    this.stack = [[EOF, 0]];
    this.charCounter = 0;
    this.lineCounter = 0;
  }

  private positionDescription(): string {
    return `[line: ${this.lineCounter}, char: ${this.charCounter}]`;
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
    if (result === "\n") {
      this.charCounter = 0;
      this.lineCounter += 1;
      // On windows lineendings we need to await till
      // carriage return is over till we keep on counting characters.
    } else if (result !== "\r") {
      this.charCounter += 1;
    }
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
        this.reject(`${this.positionDescription()} ${action.reason}`);
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
    const l = production.result.length;
    this.stack.splice(-l);
    const top = this.peekStack();
    const readState = top[1];
    const newState = this.jumpingTable.get(production.metaSymbol, readState);
    if (!newState) {
      this.reject(
        `${this.positionDescription()} No state transtion in jumbing table found for '${production.metaSymbol.toString()}' and '${readState}'`
      );
      return;
    }
    this.state = newState;
    this.stack.push([production.metaSymbol, newState]);
  }

  private accept() {
    this.state = { inLanguage: true };
  }

  private reject(reason: string) {
    this.state = { inLanguage: false, reason };
  }

  run(input: string): Result {
    this.input = input;
    while (typeof this.state === "number") {
      const char = this.peekChar();
      const action =
        this.actions.get(char, this.state) ||
        reject(
          `${this.positionDescription()} No transition for ${char.toString()} and ${
            this.state
          } found in action table.`
        );
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
      readonly type: "accept";
    }
  | {
      readonly type: "reject";
      readonly reason: string;
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
export function reject(reason: string): Action {
  return {
    type: "reject",
    reason,
  };
}
