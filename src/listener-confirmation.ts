import {startMongo, models} from './utils/mongo/config';
import {escan2, MAIN_WS_PROVIDER, providersForLC} from './utils/web3/providers';
import {_log, timeout} from './utils/configs/utils';
import {getPendingTxResponse} from './utils/web3/getTransactions';
import {proccessPending as pendingTx_uni_sushi} from './pipeline/protocols/pending';
import {pendingToConfirm, trashToconfirm} from './utils/mongo/saveConfirmed';
import { Document as _doc } from 'mongoose';

const {txM, g} = models;
const {whales} = g;
const serverName = 'qnConfirmed';
const SwV2SH = [
  '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
  '0x000000000000000000000000d9e1ce17f2641f24ae83637ab66a2cca9c378b9f',
];
const SwapV2 = [
  '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
  '0x0000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d',
];
const SwapV3 = [
  '0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67',
  '0x000000000000000000000000e592427a0aece92de3edee1f18e0157c05861564',
];

let whalesCache = new Array<any>();

startMongo(serverName).then(async started => {
  await timeout(5000);

  if (started) {
    whales.find({}, null, {}, (e, docs) => {
      if (!e) whalesCache = docs;
    });
    await timeout(2000);

    _log.start('SwapV3 listenRouter Go!');
    listenRouter(SwapV3, false);
    _log.start('SwapV2 listenRouter Go!');
    listenRouter(SwapV2, true);
    _log.start('SwV2SH listenRouter Go!');
    listenRouter(SwV2SH, true);
  } else {
    _log.error('---> started ', started);
  }
});

const listenRouter = async (filter: Array<any>, isV2: boolean) => {
  try {
    MAIN_WS_PROVIDER.on(
      {
        topics: filter,
      },
      async (data: any) => {
        const hash = data.transactionHash;
        const [knownTx_, knownTx_g_] = await Promise.all([
          txM.pending.findOne({hash}, null, {}),
          g.trash.findOne({hash}, null, {}),
        ]);
        if (knownTx_) {
          const knownTx = knownTx_._doc;
          const nTx = {...knownTx};
          delete nTx._id;
          pendingToConfirm(nTx, {}, serverName);
          return;
        }

        if (knownTx_g_) {
          const knownTx_g = knownTx_g_._doc;
          const nTx = {...knownTx_g};
          delete nTx._id;
          trashToconfirm(nTx, {}, serverName);
          return;
        }

        const tx = await getPendingTxResponse(hash, providersForLC, escan2);
        if (tx) {
          const whaleData = whalesCache.find(w =>
            w ? w.address.toLowerCase() === tx.from.toLowerCase() : false
          );
          pendingTx_uni_sushi(tx, whaleData, true, providersForLC);
        } else {
          _log.error('getPendingTxResponse ', hash, 'not found confirmed tx?');
        }
      }
    );
  } catch (e: any) {
    _log.error('listen V2 catch ', e);
  }
  return;
};
