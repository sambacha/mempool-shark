import 'dotenv/config';
import mongoose from 'mongoose';
import {_log, ENV} from '../configs/utils';
import {BlockSchema} from '../../models/BlockSchema';
import {TokenSchema} from '../../models/TokenSchema';
import {TransactionSchema} from '../../models/TransactionSchema';
import {WhalesSchema} from '../../models/WhalesSchema';
import {HashSchema} from '../../models/HashSchema';
import {PoolsSchema} from '../../models/PoolsSchema';

const PENDING = '_PENDING-txs';
const CONFIRMED = '_CONFIRMED-txs';

const TRASH = '_COMMON-TRASH-txs';
const BLOCKS = '_COMMON-BLOCKS';
const WHALES = '_COMMON-WHALES';
const HASHES = '_COMMON-HASHES';
const POOLS = '_COMMON-POOLS';
const TOKENS = '_COMMON-TOKENS';

const params = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: false,
};

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
});

process.on('unhandledRejection', (reason, p) => {
  _log.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

const startMongo = async (serverName: string): Promise<boolean> => {
  return new Promise(resolve => {
    mongoose.connect(ENV.ATLAS_STRING || '', params, (e: any) => {
      if (!e) {
        _log.success(
          `${serverName} | MONGO OK CONNECT | ${ENV.COLLECTION_PREFIX}`
        );
        checkMongo(serverName);
      } else {
        _log.error(`${serverName} | MOGNO FAIL CONNECT | `, e.message);
      }
      resolve(true);
    });
  });
};

const checkMongo = (serverName: string) => {
  mongoose.connection.on('error', (e: any) => {
    if (e) _log.error(`${serverName} | MONGO ERROR |  `, e.message);
  });

  mongoose.connection.on('disconnected', () => {
    _log.error(`${serverName} | MONGO DISCONNECT | `);
  });
};

const mongoUtils = {
  UPDATE_ONLY: [{$match: {operationType: 'update'}}],
  INSERT_ONLY: [{$match: {operationType: 'insert'}}],
  DELETE_ONLY: [{$match: {operationType: 'delete'}}],

  FIRST_QUERY: {
    limit: 20,
    sort: {timestampTx: -1},
  },

  LAST_QUERY: {
    limit: 200,
    sort: {timestampTx: 1},
  },
  INS_PEND: 'insert_pending_tx',
  DEL_PEND: 'delete_pending_tx',
  INS_CONF: 'insert_confirmed_tx',
  ignoreAddressNamespace: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
};

const models = {
  g: {
    trash: mongoose.model(TRASH, TransactionSchema),
    blocks: mongoose.model(BLOCKS, BlockSchema),
    whales: mongoose.model(WHALES, WhalesSchema),
    hashes: mongoose.model(HASHES, HashSchema),
    tokens: mongoose.model(TOKENS, TokenSchema),
    pools: mongoose.model(POOLS, PoolsSchema),
  },
  txM: {
    pending: mongoose.model(PENDING, TransactionSchema),
    confirmed: mongoose.model(CONFIRMED, TransactionSchema),
  },
};

export {models, mongoUtils, startMongo};
