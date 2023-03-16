type UnboundProduction<R extends string> = (string | UnboundRule<R>)[];

type UnboundGrammar<R extends string> = Record<R, UnboundProduction<R>[]>;

export type UnboundRule<R extends string> = { rule: R };
export function R<R extends string>(name: R): UnboundRule<R> {
  return { rule: name };
}

class Rule<R extends string> {
  constructor(readonly unboundGrammar: UnboundGrammar<R>, readonly name: R) {}
  get grammar() {
    return new Grammar(this.unboundGrammar);
  }

  get unbound() {
    return R(this.name);
  }

  productions(): Array<Production<R>> {
    return this.unboundGrammar[this.name].map(
      (p) => new Production(this.unboundGrammar, this.name, p)
    );
  }
}

class Production<R extends string> {
  constructor(
    readonly unboundGrammar: UnboundGrammar<R>,
    readonly ruleName: R,
    readonly unbound: UnboundProduction<R>
  ) {}

  get rule() {
    return new Rule(this.unboundGrammar, this.ruleName);
  }

  get grammar() {
    return new Grammar(this.unboundGrammar);
  }
}

class Grammar<R extends string> {
  constructor(readonly unbound: UnboundGrammar<R>) {}

  rule(name: R): Rule<R> {
    return new Rule(this.unbound, name);
  }
}

export class DynamicParser<R extends string> {
  constructor(readonly rules: UnboundGrammar<R>) {}
}
