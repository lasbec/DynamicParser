import { range } from "lodash";

type UnboundProduction<R extends string> = (string | UnboundRule<R>)[];
type UnboundGrammar<R extends string> = Record<R, UnboundProduction<R>[]>;

export type UnboundRule<R extends string> = { rule: R };
export function R<R extends string>(name: R): UnboundRule<R> {
  return { rule: name };
}
function isInt(x: unknown): x is number {
  return Number.isInteger(x);
}

type Char = string & { length: 1 };
function isChar(c: string): c is Char {
  return c.length === 1;
}
function assertChar(c: string): asserts c is Char {
  if (!isChar(c)) throw new Error(`Expected '${c}' to be single character.`);
}
function asChar(c: string): Char {
  assertChar(c);
  return c;
}

function buildDynamicParser<R extends string>(
  unboundGrammar: UnboundGrammar<R>
) {
  class Grammar {
    constructor(readonly unbound: UnboundGrammar<R>) {}

    rule(name: R): Rule {
      return new Rule(name);
    }

    unsafeRule(name: string): Rule | undefined {
      if (name in this.unbound) return this.rule(name as R);
      return;
    }
  }
  const grammar = new Grammar(unboundGrammar);

  class Rule {
    constructor(readonly name: R) {}
    get unbound() {
      return R(this.name);
    }

    productions(): Array<Production> {
      return unboundGrammar[this.name].map(
        (p, index) => new Production(this.name, index, p)
      );
    }
  }

  class Production {
    constructor(
      readonly ruleName: R,
      readonly position: number,
      readonly unbound: UnboundProduction<R>
    ) {}

    get rule() {
      return new Rule(this.ruleName);
    }
    hypothesis(): ProductionHypothesis {
      return ProductionHypothesis.from(this);
    }

    get(index: number): Rule | string | undefined {
      const entry = this.unbound[index];
      if (typeof entry === "string") return entry;
      if (!entry) return entry;
      return new Rule(entry.rule);
    }
  }

  class ProductionHypothesis extends Production {
    static from(production: Production): ProductionHypothesis {
      return new ProductionHypothesis(production, 0);
    }

    private constructor(production: Production, readonly pointer: number) {
      super(production.ruleName, production.position, production.unbound);
    }

    shift(): ProductionHypothesis | undefined {
      if (this.unbound.length > this.pointer) {
        return new ProductionHypothesis(this, this.pointer + 1);
      }
      return;
    }

    get next(): Rule | string {
      return this.get(this.pointer) as Rule | string;
    }

    pathToNext(): [Rule[], string] {}

    private static stringFormSeparator = "\t";

    toString(): string {
      return [`${this.ruleName}`, `${this.position}`, `${this.pointer}`].join(
        ProductionHypothesis.stringFormSeparator
      );
    }

    static fromString(str: string): ProductionHypothesis {
      const [ruleName, positionStr, pointerStr] = str.split(
        ProductionHypothesis.stringFormSeparator
      );
      const position = parseInt(positionStr);
      const pointer = parseInt(positionStr);
      if (!isInt(position) || !isInt(pointer))
        throw Error(`Invalid ProductionHypothesis '${str}'`);
      const rule = grammar.unsafeRule(ruleName);
      if (!rule) throw Error(`Invalid rule '${ruleName}'`);
      const production = rule.productions()[position];
      let result: ProductionHypothesis | undefined =
        ProductionHypothesis.from(production);
      for (const _ of range(pointer)) {
        result = result?.shift();
      }
      if (!result) throw new Error(`Pointer out of range ${str}`);
      return result;
    }
  }

  class ParserState {
    private constructor(
      readonly possibleHypothesis: Array<ProductionHypothesis>
    ) {}
    private static stringFormSeparator = "\n";
    private static stringFormEnding = "$$25";

    static empty(): ParserState {
      return new ParserState([]);
    }

    toString() {
      return (
        this.possibleHypothesis
          .map((x) => x.toString())
          .join(ParserState.stringFormSeparator) + ParserState.stringFormEnding
      );
    }

    static fromString<R extends string>(str: string): ParserState {
      return new ParserState(
        str
          .slice(ParserState.stringFormEnding.length)
          .split(ParserState.stringFormSeparator)
          .map(ProductionHypothesis.fromString)
      );
    }
  }

  class JumpingTable {
    private constructor(
      readonly mapping: Map<string, [string, Rule | undefined]>
    ) {}
    static construct() {
      return new JumpingTable(new Map());
    }

    parsePath(str: string, state: string) {
      const result: Rule[] = [];
      for (const char of str) {
        const next = this.mapping.get(state + char);
        if (!next) throw new Error(`Unexpected char '${char}'.`);
        const [newState, rule] = next;
        if (rule) result.push(rule);
        state = newState;
      }
      return result;
    }
  }
}
export class DynamicParser<R extends string> {
  constructor(readonly rules: UnboundGrammar<R>) {}
}
