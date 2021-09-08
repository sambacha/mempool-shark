import {nowMs, _log} from '../../../utils/configs/utils';
import {getMempoolData} from '../mempool/getMempoolData';
import {createPending} from '../../../utils/mongo/savePending';
import {createConfirm} from '../../../utils/mongo/saveConfirmed';
import {getTokens} from '../../../utils/web3/getTokens';
import {_V3_FNAME_ONLY_SWAP} from '../../../utils/web3/utils';
import {IContractSharkTx} from '../../../models/TransactionSchema';
import {getV3InternalSwap} from './getV3InternalSwap';
import {models} from '../../../utils/mongo/config';

const {g} = models;
const {hashes} = g;

const pName = 'qnPending_v3_multiswap';

export const handleMultiSwap = async (
  tx: IContractSharkTx,
  dexSpace: string,
  directConfirm: boolean,
  providers: Array<any>
) => {
  try {
    const {decodedData} = tx.mempoolData;
    let fromTokenAddress = '';
    let toTokenAddress = '';
    const multiSwapCalls = [];

    for (let i = 0; i < decodedData.length; i++) {
      const internalCall = await getV3InternalSwap(decodedData[i]);
      if (internalCall) {
        const {decodedInnerData, checkedPath, innerMethod, fee} = internalCall;
        if (_V3_FNAME_ONLY_SWAP.indexOf(innerMethod) >= 0) {
          if (fromTokenAddress === '') {
            fromTokenAddress = checkedPath[0];
          }
          toTokenAddress = checkedPath[checkedPath.length - 1];

          const tks = await getTokens(checkedPath, pName, dexSpace, providers);
          if (tks && tks.length === checkedPath.length) {
            const innerCall = await getMempoolData(
              {
                ...tx,
                mempoolData: {
                  txMethod: innerMethod,
                  decodedData: decodedInnerData,
                  fee,
                },
              },
              tks,
              dexSpace
            );
            if (innerCall) {
              multiSwapCalls.push(innerCall);
            }
          } else {
            _log.warn(
              'handleMultiSwap',
              dexSpace,
              tx.hash,
              'not tks or tks.length !== checkedPath.length'
            );
          }
        }
      }
    }
    if (multiSwapCalls.length > 0) {
      for (const swapCall of multiSwapCalls) {
        const toCreate = {
          ...tx,
          fromTokenAddress: swapCall.input.address,
          toTokenAddress: swapCall.output.address,
          mempoolData: {
            ...tx.mempoolData,
            multiSwapCalls,
            ...swapCall,
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
    }
  } catch (e: any) {
    _log.error('handleMultiswap catch', dexSpace, e.message, tx.hash);
  }
  return;
};
