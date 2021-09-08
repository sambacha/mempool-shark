import {checksum, _log} from '../../../utils/configs/utils';
import {iUniV3Router} from '../../../utils/web3/abis-interfaces';
import {
  V3_SWAP_SIGS,
  _V3_FNAME_ONLY_SWAP,
  _V3_SIGS_ONLY_SWAP,
} from '../../../utils/web3/utils';

const {exactInputSig, exactOutputSig} = V3_SWAP_SIGS;

async function getV3InternalSwap(decodeMe: string) {
  try {
    const innerMethodSig = decodeMe.substring(0, 10);
    const isSwap = _V3_SIGS_ONLY_SWAP.indexOf(innerMethodSig);

    if (isSwap >= 0) {
      const innerMethod = _V3_FNAME_ONLY_SWAP[isSwap];
      const decodedInnerData = iUniV3Router.decodeFunctionData(
        innerMethod,
        decodeMe
      )[0];

      let fromTokenAddress = null;
      let midTokenAddress = null;
      let toTokenAddress = null;
      let fee = null;
      let checkedPath = [];

      if (innerMethodSig === exactOutputSig) {
        const path = decodedInnerData['path'];
        fromTokenAddress = checksum('0x' + path.slice(94, 134));
        midTokenAddress = checksum('0x' + path.slice(48, 88));
        toTokenAddress = checksum(path.slice(0, 42));
        checkedPath = [];
      } else if (innerMethodSig === exactInputSig) {
        const path = decodedInnerData['path'];
        fromTokenAddress = checksum(path.slice(0, 42));
        midTokenAddress = checksum('0x' + path.slice(48, 88));
        toTokenAddress = checksum('0x' + path.slice(94, 134));
        checkedPath = [];
      } else {
        fromTokenAddress = checksum(decodedInnerData['tokenIn']);
        toTokenAddress = checksum(decodedInnerData['tokenOut']);
        fee = decodedInnerData['fee'];
      }

      checkedPath.push(fromTokenAddress);
      midTokenAddress && checkedPath.push(midTokenAddress);
      checkedPath.push(toTokenAddress);

      if (checkedPath.length > 0) {
        return {
          checkedPath,
          innerMethod,
          decodedInnerData,
          fee,
        };
      }
      //
    }
  } catch (e: any) {
    _log.error('internalSwap', e.message);
  }
  return null;
}

export {getV3InternalSwap};
