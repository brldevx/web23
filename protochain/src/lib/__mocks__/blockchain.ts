import Block from "./block";
import Validation from "../validation";

/**
 * Blockchain mock Class
 */
class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;

  /**
   * Creates a new mocked blockchain with a genesis block
   */
  constructor() {
    this.blocks = [
      new Block({
        index: 0,
        hash: "abc",
        previousHash: "",
        data: "Genesis Block",
        timestamp: Date.now(),
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
    if (block.index < 0) return new Validation(false, "Invalid mock block");

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
    return new Validation();
  }
}

export default BlockChain;
