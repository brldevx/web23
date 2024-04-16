import Validation from "../validation";

/**
 * Mocked TransactionInput class
 */
class TransactionInput {
  fromAdress: string;
  amount: number;
  signature: string;

  /**
   *  Creates a new transaction input object
   * @param txInput
   */
  constructor(txInput?: TransactionInput) {
    this.fromAdress = txInput?.fromAdress || "carteira1";
    this.amount = txInput?.amount || 10;
    this.signature = txInput?.signature || "abc";
  }

  /**
   * Signs the transaction input
   * @param privateKey The private key to sign the transaction input
   */
  sign(privateKey: string): void {
    this.signature = "abc";
  }

  /**
   * Gets the hash of the transaction input
   * @returns The hash of the transaction input
   */
  getHash(): string {
    return "abc";
  }

  /**
   * Validates if the tx input is valid
   * @returns A validation object
   */
  isValid(): Validation {
    if (!this.signature) {
      return new Validation(false, "Signature is required!");
    }
    if (this.amount < 1) {
      return new Validation(false, "Amount must be greater than zero!");
    }

    return new Validation();
  }
}

export default TransactionInput;
