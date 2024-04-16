/**
 * File name: blockchain.ts
 * Description: File responsible for implementing the blockchain class.
 * Author: brldevx
 * Creation date: 04/11/2024
 */

import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./block-info";
import Transaction from "./transaction";
import TransactionType from "./transactionType";
import TransactionSearch from "./transaction-search";
import TransactionInput from "./transactionInput";

/**
 * Blockchain Class
 */
class BlockChain {
  blocks: Block[];
  mempool: Transaction[];
  nextIndex: number = 0;

  static readonly DIFFICULTY_FACTOR: number = 5;
  static readonly TX_PER_BLOCK: number = 2;
  static readonly MAX_DIFFICULTY: number = 62;

  /**
   * Creates a new blockchain with a genesis block
   */
  constructor() {
    this.mempool = [];
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: "",
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            txInput: new TransactionInput(),
          } as Transaction),
        ],
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
   * @param transaction
   * @returns Return true if the transaction is valid
   */
  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid();
    if (!validation.success) {
      return new Validation(false, `Invalid tx: ${validation.message}`);
    }

    if (
      this.blocks.some((b) =>
        b.transactions.some((tx) => tx.hash === transaction.hash)
      )
    ) {
      return new Validation(false, "Duplicated tx in blockchain.");
    }

    if (this.mempool.some((tx) => tx.hash === transaction.hash)) {
      return new Validation(false, "Duplicated tx in mempool.");
    }

    this.mempool.push(transaction);
    return new Validation(true, transaction.hash);
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

    const txs = block.transactions
      .filter((tx) => tx.type !== TransactionType.FEE)
      .map((tx) => tx.hash);

    const newMempool = this.mempool.filter((tx) => !txs.includes(tx.hash));

    if (newMempool.length + txs.length !== this.mempool.length) {
      return new Validation(false, "Invalid tx in block: mempool");
    }

    this.mempool = newMempool;

    this.blocks.push(block);
    this.nextIndex++;
    return new Validation(true, block.hash);
  }

  /**
   *
   * @param hash
   * @returns
   */
  getBlock(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash);
  }

  getTransaction(hash: string): TransactionSearch {
    const mempoolIndex = this.mempool.findIndex((tx) => tx.hash === hash);
    if (mempoolIndex !== -1) {
      return {
        mempoolIndex,
        transaction: this.mempool[mempoolIndex],
      } as TransactionSearch;
    }
    const blockIndex = this.blocks.findIndex((b) =>
      b.transactions.some((tx) => tx.hash === hash)
    );
    if (blockIndex !== -1) {
      return {
        blockIndex,
        transaction: this.blocks[blockIndex].transactions.find(
          (tx) => tx.hash === hash
        ),
      } as TransactionSearch;
    }
    return {
      blockIndex: -1,
      mempoolIndex: -1,
    } as TransactionSearch;
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
   * @returns Returns the fee per transaction
   */
  //TODO: Implement the getFeePerTx method
  getFeePerTx(): number {
    return 1;
  }

  /**
   * @returns Returns the next block
   */
  getNextBlock(): BlockInfo | null {
    if (!this.mempool || !this.mempool.length) {
      return null;
    }

    const transactions = this.mempool.slice(0, BlockChain.TX_PER_BLOCK);

    const difficulty = this.getDifficulty();
    const previousHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const maxDifficulty = BlockChain.MAX_DIFFICULTY;

    return {
      transactions,
      difficulty,
      feePerTx,
      index,
      maxDifficulty,
      previousHash,
    } as BlockInfo;
  }
}

export default BlockChain;
