/**
 * File name: block.ts
 * Description: File responsible for implementing the block class.
 * Author: brldevx
 * Creation date: 04/11/2024
 */

import sha256 from "crypto-js/sha256";
import Validation from "./validation";
import BlockInfo from "./block-info";

/**
 * Block class
 */
class Block {
  index: number = 1;
  timestamp: number;
  hash: string = "";
  previousHash: string;
  data: string;
  nonce: number;
  miner: string;

  /**
   * Creates a new block
   * @param block Block to be created
   */
  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || "";
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return sha256(
      this.index +
        this.data +
        this.timestamp +
        this.previousHash +
        this.nonce +
        this.miner
    ).toString();
  }

  /**
   * Generate a new valid hash for the block with the specified difficulty
   * @param difficulty The Blockchain current difficulty
   * @param miner The miner wallet address
   */
  mine(difficulty: number, miner: string) {
    this.miner = miner;
    const prefix = new Array(difficulty + 1).join("0");

    do {
      this.nonce++;
      this.hash = this.getHash();
    } while (!this.hash.startsWith(prefix));
  }

  /**
   * Validates the block
   * @param previousHash Previous block hash
   * @param previousIndex Previous block index
   * @param difficulty The Blockchain current difficulty
   * @returns Returns if the block is valid
   */
  isValid(
    previousHash: string,
    previousIndex: number,
    difficulty: number
  ): Validation {
    if (previousIndex !== this.index - 1)
      return new Validation(false, "Invalid index");
    if (!this.data) return new Validation(false, "Invalid data");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
    if (this.previousHash !== previousHash)
      return new Validation(false, "Invalid previous hash");

    if (!this.nonce || !this.miner) return new Validation(false, "No mined");

    const prefix = new Array(difficulty + 1).join("0");
    if (this.hash !== this.getHash() || !this.hash.startsWith(prefix))
      return new Validation(false, "Invalid hash");

    return new Validation();
  }

  /**
   *
   * @param blockInfo
   * @returns
   */
  static fromBlockInfo(blockInfo: BlockInfo): Block {
    const block = new Block();
    block.index = blockInfo.index;
    block.previousHash = blockInfo.previousHash;
    block.data = blockInfo.data;
    return block;
  }
}

export default Block;
