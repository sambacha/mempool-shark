import {startMongo, models} from './utils/mongo/config';
import {escan1, MAIN_WS_PROVIDER, providersForLM} from './utils/web3/providers';
import {nowMs, timeout, _log} from './utils/configs/utils';
import {getPendingTxResponse} from './utils/web3/getTransactions';
import {proccessPending as pendingTx_uni_sushi} from './pipeline/protocols/pending';

const {g} = models;
const {whales, hashes} = g;
const serverName = 'qnPending';

let whalesCache = new Array<any>();

startMongo(serverName).then(async started => {
  await timeout(5000);

  if (started) {
    whales.find({}, null, {}, (e, docs) => {
      if (!e) whalesCache = docs;
    });

    startListenPending();
  } else {
    _log.warn('---> started ', started);
  }
});

const startListenPending = () => {
  MAIN_WS_PROVIDER._subscribe(
    'pending',
    ['newPendingTransactions'],
    async (hash: string) => {
      new hashes({
        hash,
        txHash: hash,
        timestampTx: nowMs(),
      }).save(async (e: any) => {
        if (!e) {
          const tx = await getPendingTxResponse(hash, providersForLM, escan1);
          if (tx) {
            const whaleData = whalesCache.find(w =>
              w ? w.address.toLowerCase() === tx.from.toLowerCase() : false
            );
            pendingTx_uni_sushi(tx, whaleData, false, providersForLM);
          }
        }
      });
    }
  );
};
