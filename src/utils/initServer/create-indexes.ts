import {_log} from '../configs/utils';
import {
  TokenSchema,
  TransactionSchema,
  BlockSchema,
  WhalesSchema,
  HashSchema,
} from '../../models/index';
import {models, startMongo} from '../mongo/config';

const {g, txM} = models;
const serverName = 'createIndexes';

startMongo(serverName).then(started => {
  if (started) {
    startServer();
  } else {
    _log.error('---> started ', serverName, started);
  }
});

const startServer = () => {
  _log.start('---> startServer ', serverName);
  createIndexes();
};

const createIndexes = () => {
  HashSchema.index({hash: 'text'}, {unique: true});
  HashSchema.index({txHash: 'hashed'});
  HashSchema.index({timestampTx: -1});
  HashSchema.index({timestampTx: 1});

  TransactionSchema.index({hash: 'text'}, {unique: true});
  TransactionSchema.index({txHash: 'hashed'});
  TransactionSchema.index({timestampTx: -1});
  TransactionSchema.index({timestampTx: 1});
  TransactionSchema.index({fromTokenAddress: 'hashed'});
  TransactionSchema.index({toTokenAddress: 'hashed'});

  TokenSchema.index({address: 'text'}, {unique: true});
  TokenSchema.index({hashAddress: 'hashed'});
  TokenSchema.index({timestampTx: -1});
  TokenSchema.index({timestampTx: 1});
  TokenSchema.index({msV3: 1});
  TokenSchema.index({msV3: -1});
  TokenSchema.index({msV2: 1});
  TokenSchema.index({msV2: -1});
  TokenSchema.index({msV2Sushi: 1});
  TokenSchema.index({msV2Sushi: -1});
  TokenSchema.index({msV2Bal: 1});
  TokenSchema.index({msV2Bal: -1});

  WhalesSchema.index({address: 'text'}, {unique: true});
  WhalesSchema.index({hashAddress: 'hashed'});
  WhalesSchema.index({timestampTx: -1});
  WhalesSchema.index({timestampTx: 1});

  BlockSchema.index({blockHash: 'text'}, {unique: true});
  BlockSchema.index({blockNumber: 1}, {unique: true});
  BlockSchema.index({blockNumber: -1});
  BlockSchema.index({timestampTx: -1});
  BlockSchema.index({timestampTx: 1});

  txM.confirmed.createIndexes((e: any) => {
    if (e) _log.error(e);
    else _log.ready('txM.confirmed.');
  });
  txM.pending.createIndexes((e: any) => {
    if (e) _log.error(e);
    else _log.ready('txM.pending.');
  });

  g.tokens.createIndexes((e: any) => {
    if (e) _log.error(e);
    else _log.ready('g.tokens');
  });
  g.whales.createIndexes((e: any) => {
    if (e) _log.error(e);
    else _log.ready('g.whales');
  });
  g.trash.createIndexes((e: any) => {
    if (e) _log.error(e);
    else _log.ready('g.trash');
  });
  g.blocks.createIndexes((e: any) => {
    if (e) _log.error(e);
    else _log.ready('g.blocks.');
  });
  g.hashes.createIndexes((e: any) => {
    if (e) _log.error(e);
    else _log.ready('g.hashes.');
  });
};
