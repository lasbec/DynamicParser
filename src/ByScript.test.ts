import { describe, expect, it } from "vitest";
import { Table } from "./Table";
import {
  Action,
  EOF,
  ShiftReduceMachine,
  Terminal,
  accept,
  reduce,
  shift,
} from "./ShiftReduceMachine";
import { Char } from "./Char";

/*
 * Example Grammar:
 *0 Z ::= S
 *1 S ::= Sb
 *2 S ::= bAa
 *3 A ::= aSc
 *4 A ::= a
 *5 A ::= aSb
 */
describe("ByScript", () => {
  const actionTable = Table.empty<Action, Terminal>()
    .setRow(0, [[Char("b"), shift(3)]])
    .setRow(1, [
      [Char("b"), shift(2)],
      [EOF, accept()],
    ])
    .setRow(2, [
      [Char("b"), reduce(1)],
      [EOF, reduce(1)],
    ])
    .setRow(3, [[Char("a"), shift(6)]])
    .setRow(4, [[Char("a"), shift(5)]])
    .setRow(5, [
      [Char("b"), reduce(2)],
      [Char("c"), reduce(2)],
      [EOF, reduce(2)],
    ])
    .setRow(6, [
      [Char("a"), reduce(4)],
      [Char("b"), shift(3)],
    ])
    .setRow(7, [
      [Char("b"), shift(9)],
      [Char("c"), shift(8)],
    ])
    .setRow(8, [[Char("a"), reduce(4)]])
    .setRow(9, [
      [Char("a"), reduce(5)],
      [Char("b"), reduce(1)],
      [Char("c"), reduce(1)],
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
