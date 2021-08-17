import {Schema} from 'mongoose';

const TokenSchema = new Schema(
  {
    address: String,
    hashAddress: String,
    chainId: Number,
    name: String,
    symbol: String,
    decimals: Number,
    logoURI: String,
    by: String,

    timestampTx: Number,
    msV3: Number,
    msV2: Number,
    msV2Sushi: Number,

    isGeneral: Boolean,
    isV2: Boolean,
    isV3: Boolean,
    isV2Sushi: Boolean,
  },
  {autoIndex: false}
);

export {TokenSchema};
