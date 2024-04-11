import { describe, test, expect } from "@jest/globals";
import Block from "../src/lib/block";

describe("Block tests", () => {
  test("Should be valid", () => {
    const block = new Block(1, "abc");
    const isValid = block.isValid();
    expect(isValid).toBeTruthy();
  });

  test("Should NOT be valid (HASH)", () => {
    const block = new Block(1, "");
    const isValid = block.isValid();
    expect(isValid).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block(-1, "abc");
    const isValid = block.isValid();
    expect(isValid).toBeFalsy();
  });
});
