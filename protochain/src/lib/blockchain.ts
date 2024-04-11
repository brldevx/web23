/**
 * Nome do arquivo: blockchain.ts
 * Descrição: Arquivo responsável por implementar a classe Blockchain.
 * Autor: brldevx
 * Data de criação: 11/04/2024
 */

import Block from "./block";

/**
 * Blockchain Class
 */
class BlockChain {
  blocks: Block[];

  /**
   * Creates a new blockchain with a genesis block
   */
  constructor() {
    this.blocks = [new Block(0, "genesis")];
  }
}

export default BlockChain;
