import {IContractSharkTx} from '../../models/TransactionSchema';
import {nowMs, _log} from '../configs/utils';
import {models} from './config';

const createPending = async (tx: IContractSharkTx, message: string) => {
  try {
    const timestampTx = nowMs();
    new models.txM.pending({
      ...tx,
      notes: {
        message,
        timestampTx,
      },
    }).save((e: any) => {
      if (!e) _log.info('New Pending Saved', '|', tx.hash, '|', message);
      if (e) _log.error(e);
    });
  } catch (e: any) {
    _log.error('txM catch', e.message);
  }
  return;
};

export {createPending};
