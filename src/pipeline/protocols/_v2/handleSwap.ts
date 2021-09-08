import {nowMs, _log} from '../../../utils/configs/utils';
import {createPending} from '../../../utils/mongo/savePending';
import {createConfirm} from '../../../utils/mongo/saveConfirmed';
import {getTokens} from '../../../utils/web3/getTokens';
import {IContractSharkTx} from '../../../models/TransactionSchema';
import {getMempoolData} from '../mempool/getMempoolData';
import {models} from '../../../utils/mongo/config';

const {g} = models;
const {hashes} = g;
const pName = 'qnPending_v2';

export const handleSwap = async (
  tx: IContractSharkTx,
  dexSpace: string,
  directConfirm: boolean,
  providers: Array<any>
) => {
  try {
    const {checkedPath} = tx.mempoolData;
    const tks = await getTokens(checkedPath, pName, dexSpace, providers);

    if (tks && checkedPath && tks.length === checkedPath.length) {
      const mempoolData = await getMempoolData(tx, tks, dexSpace);
      const l = tks.length - 1;
      const firstToken = tks[0];
      const lastToken = tks[l];
      const fromTokenAddress = firstToken ? firstToken.address : checkedPath[0];
      const toTokenAddress = lastToken ? lastToken.address : checkedPath[l];
      if (mempoolData) {
        const toCreate = {
          ...tx,
          fromTokenAddress,
          toTokenAddress,
          checkedPath,
          mempoolData: {
            ...tx.mempoolData,
            ...mempoolData,
          },
        };
        if (directConfirm) {
          new hashes({
            hash: tx.hash,
            txHash: tx.hash,
            timestampTx: nowMs(),
          }).save(async (e: any) => {
            if (!e) {
              createConfirm(toCreate, 'directConfirm');
            }
          });
        } else {
          createPending(toCreate, dexSpace);
        }
      } else {
        _log.warn(
          'handleSwap',
          dexSpace,
          tx.hash,
          'no mempool data after compute swap?'
        );
      }
    } else {
      _log.warn(
        'handleSwap',
        dexSpace,
        tx.hash,
        'not tks or tks.length !== checkedPath.length'
      );
    }
  } catch (e: any) {
    _log.error('handleSwap', dexSpace, tx.hash, e);
  }
  return;
};
