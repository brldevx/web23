import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import readline from "readline";
import Wallet from "../lib/wallet";
import Transaction from "../lib/transaction";
import TransactionType from "../lib/transactionType";
import TransactionInput from "../lib/transactionInput";

const BLOCKCHAIN_SERVER =
  process.env.BLOCKCHAIN_SERVER || "http://localhost:3000";

let myWalletPub = "";
let myWalletPriv = "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function nmenu() {
  setTimeout(() => {
    console.clear();

    if (myWalletPub) {
      console.log("you are logged in as: ", myWalletPub);
    } else {
      console.log("you are not logged in");
    }

    console.log("1 - Create Wallet");
    console.log("2 - Recover Wallet");
    console.log("3 - Balance");
    console.log("4 - Send Transaction");
    console.log("5 - Search TX");

    rl.question("Choose your option: ", (answer) => {
      switch (answer) {
        case "1":
          createWallet();
          break;
        case "2":
          recoverWallet();
          break;
        case "3":
          getBalance();
          break;
        case "4":
          sendTransaction();
          break;
        case "5":
          searchTx();
          break;
        default: {
          console.log("Invalid option");
          nmenu();
        }
      }
    });
  }, 1000);
}

function preMenu() {
  rl.question(`Press any key to continue...`, () => {
    nmenu();
  });
}

function createWallet() {
  console.clear();
  const wallet = new Wallet();
  console.log(wallet);

  myWalletPub = wallet.publicKey;
  myWalletPriv = wallet.privateKey;
  preMenu();
}

function recoverWallet() {
  console.clear();
  rl.question("What is your private key or WIF?: ", (wifOrPrivateKey) => {
    const wallet = new Wallet(wifOrPrivateKey);
    console.log(`Your recovered wallet is: `);
    console.log(wallet);

    myWalletPub = wallet.publicKey;
    myWalletPriv = wallet.privateKey;
    preMenu();
  });
}

function getBalance() {
  console.clear();
  if (!myWalletPub) {
    console.log("You don't have a wallet yet");
    return preMenu();
  }

  //TODO: get balance from the blockchain
  preMenu();
}

function sendTransaction() {
  console.clear();

  if (!myWalletPub) {
    console.log("You don't have a wallet yet");
    return preMenu();
  }

  console.log(`Your wallet is: ${myWalletPub}`);
  rl.question(`Enter the receiver's wallet: `, (receiverWallet) => {
    if (receiverWallet.length !== 66) {
      console.log("Invalid receiver wallet");
      return preMenu();
    }

    rl.question(`Enter the amount to send: `, async (amountStr) => {
      const amount = parseInt(amountStr);
      if (!amount) {
        console.log("Invalid amount");
        return preMenu();
      }

      //TODO: balance validation
      const tx = new Transaction();
      tx.timestamp = Date.now();
      tx.to = receiverWallet;
      tx.type = TransactionType.REGULAR;
      tx.txInput = new TransactionInput({
        amount,
        fromAdress: myWalletPub,
      } as TransactionInput);

      tx.txInput.sign(myWalletPriv);
      tx.hash = tx.getHash();

      try {
        const txResponse = await axios.post(
          `${BLOCKCHAIN_SERVER}transactions`,
          tx
        );

        console.log(`Transaction accepted. Waiting the miners!`);
        console.log(txResponse.data.hash);
      } catch (error: any) {
        console.error(error.response ? error.response : error.message);
      }
      return preMenu();
    });
  });
  preMenu();
}

function searchTx() {
  console.clear();
  rl.question(`Enter the TX hash: `, async (hash) => {
    try {
      const txResponse = await axios.get(
        `${BLOCKCHAIN_SERVER}transactions/${hash}`
      );
      console.log(txResponse.data);
    } catch (error: any) {
      console.error(error.response ? error.response : error.message);
    }
    preMenu();
  });
}

nmenu();
