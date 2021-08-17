import {Schema} from 'mongoose';

const WhalesSchema = new Schema(
  {
    address: String,
    hashAddress: String,
    timestampTx: Number,
    twitter: {
      timestamp: Number,
      tweetID: String,
      handle: String,
    },
  },
  {autoIndex: false}
);

export {WhalesSchema};
