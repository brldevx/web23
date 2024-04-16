import { describe, test, expect, beforeAll, jest } from "@jest/globals";
import Wallet from "../src/lib/wallet";

describe("Wallet Input tests", () => {
  const exampleWif = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ";
  let alice: Wallet;

  beforeAll(() => {
    alice = new Wallet();
  });

  test("Should be valid", () => {
    const wallet = new Wallet();
    expect(wallet.privateKey).toBeTruthy();
    expect(wallet.publicKey).toBeTruthy();
  });

  test("Should recover wallet (PK)", () => {
    const wallet = new Wallet(alice.privateKey);
    expect(wallet.publicKey).toEqual(alice.publicKey);
  });

  test("Should recover wallet (WIF)", () => {
    const wallet = new Wallet(exampleWif);
    expect(wallet.publicKey).toBeTruthy();
    expect(wallet.privateKey).toBeTruthy();
  });
});
