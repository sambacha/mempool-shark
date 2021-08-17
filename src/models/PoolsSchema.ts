import {Schema} from 'mongoose';

const PoolsSchema = new Schema(
  {
    address: String,
    hashAddress: String,
    t0: String,
    t1: String,
    transactionHash: String,
    timestampTx: Number,
    blockNumber: Number,
    isV2: Boolean,
    isV3: Boolean,
    isV2Sushi: Boolean,
    state: {},
    immutables: {},
    decoded: {},
  },
  {autoIndex: false}
);

export {PoolsSchema};
