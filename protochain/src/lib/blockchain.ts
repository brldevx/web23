/**
 * File name: blockchain.ts
 * Description: File responsible for implementing the blockchain class.
 * Author: brldevx
 * Creation date: 11/04/2024
 */

import Block from "./block";
import Validation from "./validation";

/**
 * Blockchain Class
 */
class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;

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
   * @param block
   * @returns Return true if the block is valid
   */
  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();

    const validation = block.isValid(lastBlock.hash, lastBlock.index);

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
        previousBlock.index
      );
      if (!validation.success)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`
        );
    }
    return new Validation();
  }
}

export default BlockChain;
