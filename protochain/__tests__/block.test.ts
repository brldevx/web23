import { describe, test, expect, beforeAll } from "@jest/globals";
import Block from "../src/lib/block";
import BlockInfo from "../src/lib/block-info";

describe("Block tests", () => {
  const exampleDifficulty = 0;
  const exampleMiner = "John Doe";
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      index: 0,
      previousHash: "",
      data: "Genesis Block",
    } as Block);
  });

  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block 2",
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeTruthy();
  });

  test("Should create from block info", () => {
    const block = Block.fromBlockInfo({
      data: "block 2",
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo);

    block.mine(exampleDifficulty, exampleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeTruthy();
  });

  test("Should be valid (fallbacks)", () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (Previous HASH)", () => {
    const block = new Block({
      index: 1,
      previousHash: "",
      data: "block 2",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block 2",
    } as Block);
    block.timestamp = -1;
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (empty hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block 2",
    } as Block);
    block.mine(exampleDifficulty, exampleMiner);

    block.hash = "";

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (empty mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block 2",
    } as Block);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: "abc",
      data: "",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: "abc",
      data: "block 2",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  });
});
