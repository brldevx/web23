import * as ecc from "tiny-secp256k1";
import ECPairFactory from "ecpair";
import sha256 from "crypto-js/sha256";
import Validation from "./validation";

const ECPair = ECPairFactory(ecc);

/**
 * TransactionInput class
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
    this.fromAdress = txInput?.fromAdress || "";
    this.amount = txInput?.amount || 0;
    this.signature = txInput?.signature || "";
  }

  /**
   * Signs the transaction input
   * @param privateKey The private key to sign the transaction input
   */
  sign(privateKey: string): void {
    this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"))
      .sign(Buffer.from(this.getHash(), "hex"))
      .toString("hex");
  }

  /**
   * Gets the hash of the transaction input
   * @returns The hash of the transaction input
   */
  getHash(): string {
    return sha256(this.fromAdress + this.amount).toString();
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

    const hash = Buffer.from(this.getHash(), "hex");
    const isValid = ECPair.fromPublicKey(
      Buffer.from(this.fromAdress, "hex")
    ).verify(hash, Buffer.from(this.signature, "hex"));

    return isValid
      ? new Validation()
      : new Validation(false, "Invalid txinput signature!");
  }
}

export default TransactionInput;
