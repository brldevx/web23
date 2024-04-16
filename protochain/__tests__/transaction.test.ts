import { describe, test, expect, beforeAll, jest } from "@jest/globals";
import Transaction from "../src/lib/transaction";
import TransactionType from "../src/lib/transactionType";
import TransactionInput from "../src/lib/transactionInput";

jest.mock("../src/lib/transactionInput");

describe("Transaction tests", () => {
  test("Should be valid (REGULAR default)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "carteira2",
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (invalid HASH)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "carteira2",
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should be valid (FEE)", () => {
    const tx = new Transaction({
      to: "carteira2",
      type: TransactionType.FEE,
    } as Transaction);

    tx.txInput = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid();
    expect(valid.success).toBeTruthy();
  });

  test("Should NOT be valid (invalid to)", () => {
    const tx = new Transaction();
    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (invalid to)", () => {
    const tx = new Transaction({
      to: "carteira2",
      txInput: new TransactionInput({
        amount: -10,
        fromAdress: "carteiraFrom",
        signature: "abc",
      } as TransactionInput),
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  });
});
