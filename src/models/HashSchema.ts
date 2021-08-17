import {Schema} from 'mongoose';

const HashSchema = new Schema(
  {
    hash: String,
    txHash: String,
    timestampTx: Number,
  },
  {autoIndex: false}
);

export {HashSchema};
