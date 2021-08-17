import {startMongo, models} from './utils/mongo/config';
import {ENV, _log, KEYS, nowMs, timeout} from './utils/configs/utils';
import {mainWsComm} from './utils/web3/providers';
import {getBlockInfo, getBlock} from './utils/web3/getBlocks';
import {saveBlock, updateBlock} from './utils/mongo/saveBlock';
import {pendingOld} from './utils/mongo/saveConfirmed';

const {txM, g} = models;
const {
  BLOCKNATIVE_API_URL,
  GAS_STATION_API_URL,
  BLOCKNATIVE_API_OPT,
  GAS_STATION_API_OPT,
} = KEYS;
const {ES_BLOCK} = ENV;

const FIXER_INTERVAL: number = 60000 * 1;
const FIXER_INTERVAL_G: number = 60000 * 60;

const serverName = 'qnCommons';

startMongo(serverName).then(async started => {
  await timeout(5000);
  if (started) {
    _log.start('startFixer Go run every', FIXER_INTERVAL / 60000, 'minutes');
    startFixerJustKill();
    startFixerG();
    startBlocks();

    setInterval(() => {
      startFixerJustKill();
    }, FIXER_INTERVAL);

    setInterval(() => {
      startFixerG();
    }, FIXER_INTERVAL_G);

    setInterval(() => {
      proccessBlockQueue();
    }, 10000);
  } else {
    _log.warn('---> startFixer ', started);
  }
});

const startBlocks = async () => {
  _log.start('startBlocks Go!');

  mainWsComm.on('block', async (number: any) => {
    proccessBlock(number);
  });
};

const proccessBlock = async (number: number) => {
  try {
    _log.info('New Block: ', ES_BLOCK + number);
    const block = await getBlock(number, mainWsComm);

    if (block) {
      saveBlock({
        blockLink: ES_BLOCK + block.number,
        blockHash: block.hash,
        blockNumber: block.number,
        timestampTx: nowMs(),
        blockHeader: block,
        by: serverName,
      });
    }
  } catch (e: any) {
    _log.error('ProccessBlock catch ', number, e);
  }
  return;
};

const proccessBlockQueue = async () => {
  try {
    const b = await models.g.blocks.findOne({fullyUpdated: false}, null, {
      sort: {timestampTx: -1},
    });
    if (b) {
      if (b.blockNumber) {
        const [gasnowResponse, bncResponseData] = await Promise.all([
          getBlockInfo(GAS_STATION_API_URL, GAS_STATION_API_OPT),
          getBlockInfo(BLOCKNATIVE_API_URL, BLOCKNATIVE_API_OPT),
        ]);

        if (bncResponseData && gasnowResponse) {
          await updateBlock(b.blockHash, b.blockNumber, {
            responseData: bncResponseData,
            responseDataGas: gasnowResponse,
          });
        }
      }
    }
  } catch (e: any) {
    _log.warn('proccessBlockQueue catch', e.message);
  }

  return;
};

const startFixerJustKill = async () => {
  const old_txs = 7;

  const end = new Date();
  end.setMinutes(new Date().getMinutes() - old_txs);
  _log.start(
    'startFixer starting to fix all txs older than',
    old_txs,
    'minutes'
  );

  const _txM = await txM.pending.find({timestampTx: {$lt: end.getTime()}}, {});
  if (_txM) fixOlds(_txM);
};

const fixOlds = async (oldTxs: Array<any>) => {
  try {
    for (const tx of oldTxs) {
      const nTx = {...tx._doc};
      delete nTx._id;
      pendingOld({...nTx}, serverName);
    }
  } catch (e) {
    _log.error('fixOlds catch ', e);
  }
};

const startFixerG = async () => {
  const old_g = 240;

  const end = new Date();
  end.setMinutes(new Date().getMinutes() - old_g);
  _log.start(
    'startFixerG starting to delete all trash hashes older than',
    old_g,
    'minutes'
  );

  await g.hashes.deleteMany({timestampTx: {$lt: end.getTime()}}, {});
  await g.trash.deleteMany({timestampTx: {$lt: end.getTime()}}, {});
};
