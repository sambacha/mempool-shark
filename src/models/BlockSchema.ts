import {Schema} from 'mongoose';

const BlockHeaderSchema = new Schema({
  author: String,
  difficulty: String,
  extraData: String,
  gasLimit: Number,
  gasUsed: Number,
  hash: String,
  miner: String,
  nonce: String,
  parentHash: String,
  size: Number,
  sha3Uncles: String,
  transactionRoot: String,
  stateRoot: String,
  receiptRoot: String,
  timestamp: String,
  number: Number,
});

const BlockNativeSchema = new Schema({
  system: String,
  network: String,
  unit: String,
  maxPrice: Number,
  currentBlockNumber: Number,
  msSinceLastBlock: Number,
  blockPrices: Array,
});

const BlockGasSchema = new Schema({
  fastest: Number,
  fast: Number,
  safeLow: Number,
  average: Number,
});

const BlockSchema = new Schema(
  {
    blockLink: String,
    blockHash: String,
    blockNumber: Number,
    fullyUpdated: Boolean,
    responseData: BlockNativeSchema,
    blockHeader: BlockHeaderSchema,
    responseDataGas: BlockGasSchema,
    by: String,
    timestampTx: Number,
  },
  {autoIndex: false}
);

export {BlockSchema};
