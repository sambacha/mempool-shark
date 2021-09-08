import {checksum, nowMs, _log} from '../../../utils/configs/utils';
import {getMempoolData} from '../mempool/getMempoolData';
import {createPending} from '../../../utils/mongo/savePending';
import {createConfirm} from '../../../utils/mongo/saveConfirmed';
import {getTokens} from '../../../utils/web3/getTokens';
import {V3_SWAP_FNAME} from '../../../utils/web3/utils';
import {IContractSharkTx} from '../../../models/TransactionSchema';
import {models} from '../../../utils/mongo/config';

const {g} = models;
const {hashes} = g;

const {EI, EIS, EO, EOS} = V3_SWAP_FNAME;
const pName = 'qnPending_v3_swap';

export const handleSwap = async (
  tx: IContractSharkTx,
  dexSpace: string,
  directConfirm: boolean,
  providers: Array<any>
) => {
  try {
    const {txMethod, decodedData} = tx.mempoolData;
    let fromTokenAddress = '';
    let midTokenAddress = null;
    let toTokenAddress = '';
    let fee = null;
    const checkedPath = [];

    if (txMethod === EIS || txMethod === EOS) {
      fromTokenAddress = checksum(decodedData['tokenIn']);
      toTokenAddress = checksum(decodedData['tokenOut']);
      fee = decodedData['fee'];
    } else if (txMethod === EO || txMethod === EI) {
      const path = decodedData['path'];
      midTokenAddress = checksum('0x' + path.slice(48, 88));

      fromTokenAddress = checksum(
        txMethod === EO ? '0x' + path.slice(94, 134) : path.slice(0, 42)
      );
      toTokenAddress = checksum(
        txMethod === EI ? '0x' + path.slice(94, 134) : path.slice(0, 42)
      );
    }
    checkedPath.push(fromTokenAddress);
    midTokenAddress && checkedPath.push(midTokenAddress);
    checkedPath.push(toTokenAddress);

    if (checkedPath.length > 0) {
      const tks = await getTokens(checkedPath, pName, dexSpace, providers);
      if (tks && tks.length === checkedPath.length) {
        const mempoolData = await getMempoolData(
          {
            ...tx,
            mempoolData: {txMethod, decodedData, checkedPath, fee},
          },
          tks,
          dexSpace
        );
        if (mempoolData) {
          const toCreate = {
            ...tx,
            fromTokenAddress,
            toTokenAddress,
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
        }
      } else {
        _log.warn(
          'handleSwap',
          dexSpace,
          tx.hash,
          'not tks or tks.length !== checkedPath.length'
        );
      }
    }
  } catch (e: any) {
    _log.error('handleSwap catch', dexSpace, e.message, tx.hash);
  }
  return;
};
