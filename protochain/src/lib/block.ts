/**
 * Block class
 */
class Block {
  index: number = 1;
  hash: string = "";

  /**
   * Creates a new block
   * @param index Block index in the blockchain
   * @param hash Block hash
   */
  constructor(index: number, hash: string) {
    this.index = index;
    this.hash = hash;
  }

  /**
   * Validates the block
   * @returns true if the block is valid
   */
  isValid(): boolean {
    if (this.index < 0) return false;
    if (!this.hash) return false;

    return true;
  }
}

export default Block;
