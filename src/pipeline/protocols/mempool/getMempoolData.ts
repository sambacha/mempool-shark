import {_log} from '../../../utils/configs/utils';
import {IContractSharkTx} from '../../../models/TransactionSchema';
import {V3_SWAP_FNAME} from '../../../utils/web3/utils';

const {EO, EOS, EI, EIS} = V3_SWAP_FNAME;

export const getMempoolData = async (
  tx: IContractSharkTx,
  tokens: Array<any>,
  dexSpace: string
) => {
  try {
    const {value, mempoolData} = tx;
    const {decodedData, txMethod} = mempoolData;

    const isExactOutV3 = txMethod === EOS || txMethod === EO;
    const isExactInV3 = txMethod === EI || txMethod === EIS;

    let amountIn = null;
    let amountOut = null;

    if (isExactOutV3 || isExactInV3) {
      amountIn = isExactOutV3
        ? decodedData['amountInMaximum']
        : decodedData['amountIn'];
      amountOut = isExactOutV3
        ? decodedData['amountOut']
        : decodedData['amountOutMinimum'];
    } else {
      amountIn = decodedData['amountIn'] || decodedData['amountInMax'] || value;
      amountOut = decodedData['amountOut'] || decodedData['amountOutMin'];
    }
    if (amountIn && amountOut) {
      const tl = tokens.length - 1;
      const t0 = tokens[0];
      const t1 = tokens[tl];

      return {
        amountIn: amountIn.toString(),
        amountOut: amountOut.toString(),
        input: t0,
        output: t1,
        tokens,
      };
    }
  } catch (e: any) {
    _log.error('getMempoolData catch', dexSpace, tx.hash, e);
  }
  return null;
};
