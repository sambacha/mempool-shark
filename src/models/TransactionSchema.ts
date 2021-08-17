// @schema Transactions
import {Schema} from 'mongoose';

interface IContractSharkTx {
  status?: string; // current status of the transaction
  hash?: string;
  txHash?: string;
  to?: string;

  isV2?: boolean;
  isV3?: boolean;
  isV2Sushi?: boolean;
  isV2Bal?: boolean;

  from?: string;
  gas?: any;
  gasPrice?: any;
  gasUsed?: string; // present on on-chain txns
  nonce?: number;
  value?: any;
  blockHash?: string;
  cumulativeGasUsed?: number;
  transactionHash?: string;
  blockNumber?: number;
  data: string;
  timestampTx: number; // the UTC time of first detection of current status
  transactionIndex?: number; // optional, present if status confirmed, failed
  logsBloom?: string;

  // CUSTOM DATA
  links?: {
    etherscan?: string;
  };
  fromTokenAddress?: string;
  toTokenAddress?: string;
  checkedPath?: any;
  // CUSTOM DATA
  whaleData?: any;
  // FOR PENDING
  mempoolData?: any;
  // FOR CONFIRMED
  logs?: any;
  events?: any;

  // wich server, when
  notes?: {
    message?: string;
    timestampTx?: number;
  };
}

const TransactionSchema = new Schema(
  {
    status: String, // @returns current status of the transaction
    hash: String,
    txHash: String,
    to: String,

    isV2: Boolean,
    isV3: Boolean,
    isV2Sushi: Boolean,
    isV2Bal: Boolean,

    from: String,
    gas: Number,
    gasPrice: String,
    gasUsed: String, //  @returns present on on-chain txns
    nonce: Number,
    value: String,
    blockHash: String,
    cumulativeGasUsed: Number,
    transactionHash: String,
    blockNumber: Number,
    data: String,
    timestampTx: Number, //  @returns the UTC time of first detection of current status
    transactionIndex: Number, // @optiona  present if status confirmed, failed
    logsBloom: String,

    // @param custom data
    links: {
      etherscan: String,
    },
    fromTokenAddress: String,
    toTokenAddress: String,
    checkedPath: Schema.Types.Mixed,

    // @param custom data
    whaleData: Schema.Types.Mixed,
    // @param pending
    mempoolData: Schema.Types.Mixed,
    // @param confirmed
    logs: Schema.Types.Mixed,
    events: Schema.Types.Mixed,

    // @param server logging info
    notes: {
      message: String,
      timestampTx: Number,
    },
  },
  {autoIndex: false}
);

export {TransactionSchema, IContractSharkTx};
// @exports Contract Shark Interface
