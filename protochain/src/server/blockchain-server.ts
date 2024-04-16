/**
 * File name: blockchain-server.ts
 * Description: File responsible for implementing the application routes.
 * Author: brldevx
 * Creation date: 12/04/2024
 */

import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import Block from "../lib/block";
import BlockChain from "../lib/blockchain";
import block from "../lib/block";
import Transaction from "../lib/transaction";

/* c8 ignore start */
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);
/* c8 ignore end */

const app = express();

const blockchain = new BlockChain();

/* c8 ignore start */
if (process.argv.includes("--run")) app.use(morgan("tiny"));
/* c8 ignore end */

app.use(express.json());

app.get("/status", (req, res, next) => {
  res.json({
    mempool: blockchain.mempool.length,
    blocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/next", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json(blockchain.getNextBlock());
});

app.get(
  "/blocks/:indexOrHash",
  (req: Request, res: Response, next: NextFunction) => {
    let block;
    if (/^[0-9]+$/.test(req.params.indexOrHash)) {
      block = blockchain.blocks[parseInt(req.params.indexOrHash)];
      return res.json(block);
    }
    block = blockchain.getBlock(req.params.indexOrHash);
    if (!block) {
      return res.sendStatus(404);
    }

    return res.json(block);
  }
);

app.post("/blocks", (req: Request, res: Response, next: NextFunction) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const block = new Block(req.body as Block);
  const validation = blockchain.addBlock(block);

  if (!validation.success) {
    return res.status(400).json(validation);
  }

  return res.status(201).json(block);
});

app.get(
  "/transactions/:hash?",
  (req: Request, res: Response, next: NextFunction) => {
    if (req.params.hash) {
      return res.json(blockchain.getTransaction(req.params.hash));
    }

    return res.json({
      next: blockchain.mempool.slice(0, BlockChain.TX_PER_BLOCK),
      total: blockchain.mempool.length,
    });
  }
);

app.post("/transactions", (req: Request, res: Response, next: NextFunction) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const tx = new Transaction(req.body as Transaction);
  const validation = blockchain.addTransaction(tx);

  if (!validation.success) {
    return res.status(400).json(validation);
  }

  return res.status(201).json(tx);
});

/* c8 ignore start */
if (process.argv.includes("--run"))
  app.listen(PORT, () =>
    console.log(`Blockchain server is running on port ${PORT}`)
  );
/* c8 ignore end */

export { app };
