import {_log, ROUTERS} from '../../utils/configs/utils';
import {
  iSushiV2Router,
  iUniV2Router,
  iUniV3Router,
} from '../../utils/web3/abis-interfaces';
import {TransactionResponse} from '@ethersproject/abstract-provider';
import {_V3_FUNC_ALLOWED_METHODS, _MULTICALL} from '../../utils/web3/utils';
import {handleMultiSwap as handleMultiSwapV3} from './_v3/handleMultiSwap';
import {handleSwap as handleSwapV3} from './_v3/handleSwap';
import {handleSwap as handleSwapV2} from './_v2/handleSwap';
import {checkTx} from '../../utils/web3/checkTxs';

const dexSpacev2 = 'v2';
const dexSpacev3 = 'v3';
const dexSpacev2sh = 'v2sh';

export const proccessPending = async (
  tx: TransactionResponse,
  whaleData: any,
  directConfirm: boolean,
  providers: Array<any>
) => {
  try {
    const isUniSpaceV2 = tx.to === ROUTERS.UNIV2;
    const isSushiSpaceV2 = tx.to === ROUTERS.SUSHIV2;
    const isUniSpaceV3 = tx.to === ROUTERS.UNIV3;

    if (isUniSpaceV2 || isSushiSpaceV2 || isUniSpaceV3) {
      let parsedTx = null;
      let dexSpace = null;

      if (isUniSpaceV2) {
        parsedTx = iUniV2Router.parseTransaction(tx);
        dexSpace = dexSpacev2;
      } else if (isSushiSpaceV2) {
        parsedTx = iSushiV2Router.parseTransaction(tx);
        dexSpace = dexSpacev2sh;
      } else if (isUniSpaceV3) {
        parsedTx = iUniV3Router.parseTransaction(tx);
        dexSpace = dexSpacev3;
      }

      if (parsedTx && dexSpace) {
        const txMethod = parsedTx.functionFragment.name;

        if (_V3_FUNC_ALLOWED_METHODS.includes(txMethod)) {
          const nTx = {
            ...checkTx(tx, whaleData, false, true, false),
            mempoolData: {
              txMethod,
              decodedData: parsedTx.args[0],
            },
          };
          txMethod === _MULTICALL
            ? handleMultiSwapV3(nTx, dexSpace, directConfirm, providers)
            : handleSwapV3(nTx, dexSpace, directConfirm, providers);
        } else if (txMethod.includes('swap')) {
          const nTx = {
            ...checkTx(tx, whaleData, isUniSpaceV2, false, isSushiSpaceV2),
            mempoolData: {
              txMethod,
              decodedData: parsedTx.args,
              checkedPath: parsedTx.args['path'],
            },
          };
          handleSwapV2(nTx, dexSpace, directConfirm, providers);
        }
      } else {
        _log.warn('proccessPending cant parse tx?', tx.hash);
      }
    }
  } catch (e: any) {
    _log.error('proccessPending catch', e.message, tx.hash);
  }
  return;
};
