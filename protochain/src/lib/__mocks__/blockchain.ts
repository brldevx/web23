import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../block-info";
import Transaction from "./transaction";
import TransactionType from "../transactionType";

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
        transactions: [
          new Transaction({
            data: "tx1",
            type: TransactionType.FEE,
          } as Transaction),
        ],
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
    return {
      transactions: [
        new Transaction({
          data: "block 2",
        } as Transaction),
      ],
      difficulty: 0,
      feePerTx: this.getFeePerTx(),
      index: 1,
      maxDifficulty: 62,
      previousHash: this.getLastBlock().hash,
    } as BlockInfo;
  }
}

export default BlockChain;
