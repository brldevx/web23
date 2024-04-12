/**
 * File name: block-info.ts
 * Description: File responsible for implementing the BlockInfo interface.
 * Author: brldevx
 * Creation date: 04/12/2024
 */

/**
 * Interface responsible for defining the structure of the BlockInfo object.
 */
export default interface BlockInfo {
  index: number;
  previousHash: string;
  difficulty: number;
  maxDifficulty: number;
  feePerTx: number;
  data: string;
}
