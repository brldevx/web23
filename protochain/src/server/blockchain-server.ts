/**
 * File name: blockchain-server.ts
 * Description: File responsible for implementing the application routes.
 * Author: brldevx
 * Creation date: 12/04/2024
 */

import express from "express";
import morgan from "morgan";
import Block from "../lib/block";
import BlockChain from "../lib/blockchain";

const PORT: number = 3000;

const app = express();

const blockchain = new BlockChain();

if (process.argv.includes("--run")) app.use(morgan("tiny"));
app.use(express.json());

app.get("/status", (req, res, next) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/:indexOrHash", (req, res, next) => {
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
});

app.post("/blocks", (req, res, next) => {
  if (req.body.hash === undefined) return res.sendStatus(422);

  const block = new Block(req.body as Block);
  const validation = blockchain.addBlock(block);

  if (!validation.success) {
    return res.status(400).json(validation);
  }

  return res.status(201).json(block);
});

if (process.argv.includes("--run"))
  app.listen(PORT, () =>
    console.log(`Blockchain server is running on port ${PORT}`)
  );

export { app };
