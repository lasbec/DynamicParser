import { describe, expect, it } from "vitest";
import {
  ShiftReduceMachine,
  accept,
  reduce,
  shift,
} from "./ShiftReduceMachine";
import { Char } from "./Level0Layer/Char";
import { EOF, T, MetaSymbol } from "./Grammar";
import { ActionTable, JumpingTable } from "./ShiftReduceMachine";

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
  const actionTable = ActionTable.empty()
    .setRow(0, [[T("b"), shift(3)]])
    .setRow(1, [
      [T("b"), shift(2)],
      [EOF, accept()],
    ])
    .setRow(2, [
      [T("b"), reduce(1)],
      [EOF, reduce(1)],
    ])
    .setRow(3, [[T("a"), shift(6)]])
    .setRow(4, [[T("a"), shift(5)]])
    .setRow(5, [
      [T("b"), reduce(2)],
      [T("c"), reduce(2)],
      [EOF, reduce(2)],
    ])
    .setRow(6, [
      [T("a"), reduce(4)],
      [T("b"), shift(3)],
    ])
    .setRow(7, [
      [T("b"), shift(9)],
      [T("c"), shift(8)],
    ])
    .setRow(8, [[T("a"), reduce(4)]])
    .setRow(9, [
      [T("a"), reduce(5)],
      [T("b"), reduce(1)],
      [T("c"), reduce(1)],
      [EOF, reduce(1)],
    ]);

  const A = new MetaSymbol("A");
  const S = new MetaSymbol("S");
  const Z = new MetaSymbol("Z");
  const jumpingTable = JumpingTable.empty()
    .set(A, 3, 4)
    .set(S, 0, 1)
    .set(S, 6, 7);

  const grammar = [
    { metaSymbol: Z, result: [S] },
    { metaSymbol: S, result: [S, T("b")] },
    { metaSymbol: S, result: [T("b"), A, T("a")] },
    { metaSymbol: A, result: [T("a"), S, T("c")] },
    { metaSymbol: A, result: [T("a")] },
    { metaSymbol: A, result: [T("a"), S, T("b")] },
  ];
  const srm = new ShiftReduceMachine(actionTable, jumpingTable, grammar);
  describe("accept and reject words", () => {
    const wordsToExecpt = ["baab", "baabb"];
    for (const word of wordsToExecpt) {
      it(word, () => {
        if (!srm.run(word).inLanguage) {
          expect(word).toEqual({ toBe: "accepted" });
        }
      });
    }

    const wordsToRejected = ["xyb", "", "babab", "babaacab"];
    for (const word of wordsToRejected) {
      it(word, () => {
        if (srm.run(word).inLanguage) {
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
