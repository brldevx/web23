/**
 * File name: miner-client.ts
 * Description: File responsible for implementing the miner client.
 * Author: brldevx
 * Creation date: 04/12/2024
 */

import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import BlockInfo from "../lib/block-info";
import Block from "../lib/block";
import Wallet from "../lib/wallet";
import Transaction from "../lib/transaction";
import TransactionType from "../lib/transactionType";

const BLOCKCHAIN_SERVER_URL = process.env.BLOCKCHAIN_SERVER;

const minerWallet = new Wallet(process.env.MINER_WALLET);

console.log("Logged as " + minerWallet.publicKey);

let totalMined = 0;

async function mineBlock() {
  console.log("Getting next block info...");
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER_URL}blocks/next`);
  if (!data) {
    console.log("No TX found. Waiting...");
    return setTimeout(() => {
      mineBlock();
    }, 5000);
  }
  const blockInfo = data as BlockInfo;

  const newBlock = Block.fromBlockInfo(blockInfo);

  newBlock.transactions.push(
    new Transaction({
      to: minerWallet.publicKey,
      type: TransactionType.FEE,
    } as Transaction)
  );

  newBlock.miner = minerWallet.publicKey;
  newBlock.hash = newBlock.getHash();

  console.log("Starting mining block # " + newBlock.index);
  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

  console.log("Block mined! Sending to blockchain...");

  try {
    await axios.post(`${BLOCKCHAIN_SERVER_URL}blocks/`, newBlock);
    console.log("Block sent and accepted by the blockchain!");
    totalMined++;
    console.log("Total mined blocks: " + totalMined);
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message);
  }

  setTimeout(() => {
    mineBlock();
  }, 1000);
}

mineBlock();
