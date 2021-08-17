import {_log} from '../configs/utils';

const getPendingTxResponse = async (
  hash: string,
  providers: Array<any>,
  escan: any
) => {
  try {
    const _txResponse = await getFromBackupProviders(hash, providers, escan);
    return _txResponse;
  } catch (e: any) {
    _log.error('getPendingTxResponse catch ', hash);
  }
  return null;
};

const getFromBackupProviders = async (
  hash: string,
  providers: Array<any>,
  escan: any
) => {
  try {
    const txResponse = await goGetIt(hash, providers, escan);
    if (txResponse) {
      const {to, from} = txResponse;
      if (to && from) {
        return txResponse;
      }
    }
  } catch (e: any) {
    if (e.message === 'noNetwork') {
      const txResponse = await goGetIt(hash, providers, escan);
      if (txResponse) {
        const {to, from} = txResponse;
        if (to && from) {
          return txResponse;
        }
      }
    }
  }
  return null;
};

const goGetIt = async (hash: string, providers: Array<any>, escan: any) => {
  const l = providers.length - 1;

  for (let i = l; i >= 0; i--) {
    try {
      const _txResponse = await providers[i].getTransaction(hash);
      if (_txResponse) return _txResponse;
    } catch (e: any) {
      _log.info(e.message);
    }
  }

  try {
    const _txResponse = await escan.getTransaction(hash);
    if (_txResponse) return _txResponse;
  } catch (e: any) {
    _log.info(e.message);
  }

  return null;
};

export {getPendingTxResponse};
