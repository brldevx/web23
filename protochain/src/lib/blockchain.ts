/**
 * File name: blockchain.ts
 * Description: File responsible for implementing the blockchain class.
 * Author: brldevx
 * Creation date: 04/11/2024
 */

import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./block-info";

/**
 * Blockchain Class
 */
class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;
  static readonly DIFFICULTY_FACTOR: number = 5;
  static readonly MAX_DIFFICULTY: number = 62;

  /**
   * Creates a new blockchain with a genesis block
   */
  constructor() {
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: "",
        data: "Genesis Block",
      } as Block),
    ];
    this.nextIndex++;
  }

  /**
   * @returns Returns last block
   */
  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   *
   * @returns Returns the difficulty of the blockchain
   */
  getDifficulty(): number {
    return Math.ceil(this.blocks.length / BlockChain.DIFFICULTY_FACTOR);
  }

  /**
   * @param block
   * @returns Return true if the block is valid
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();

    const validation = block.isValid(
      lastBlock.hash,
      lastBlock.index,
      this.getDifficulty()
    );

    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`);
    this.blocks.push(block);
    this.nextIndex++;
    return new Validation();
  }

  /**
   *
   * @param hash
   * @returns
   */
  getBlock(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash);
  }

  /**
   * Validate all blocks
   * @returns Return true if all blocks is valid
   */
  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[1];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index,
        this.getDifficulty()
      );
      if (!validation.success)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`
        );
    }
    return new Validation();
  }

  /**
   *
   * @returns Returns the fee per transaction
   */
  getFeePerTx(): number {
    return 1;
  }

  /**
   * @returns Returns the next block
   */
  getNextBlock(): BlockInfo {
    const data = new Date().toString();
    const difficulty = this.getDifficulty();
    const previusHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const maxDifficulty = BlockChain.MAX_DIFFICULTY;

    return {
      data,
      difficulty,
      feePerTx,
      index,
      maxDifficulty,
      previousHash: previusHash,
    } as BlockInfo;
  }
}

export default BlockChain;
