import {nowMs, _log} from '../configs/utils';
import {models} from './config';

const pendingOld = async (back: any, message: string) => {
  try {
    await models.txM.pending.deleteOne({hash: back.hash});
  } catch (e: any) {
    _log.error('pendingOld ', e.message);
  }
  try {
    const timestampTx = nowMs();
    new models.g.trash({
      ...back,
      status: 'old',
      timestampTx,
      notes: {
        message,
        timestampTx,
      },
    }).save((e: any) => {
      if (!e)
        _log.success(
          back.isV2
            ? 'V2_pendingOld'
            : back.isV3
            ? 'V3_pendingOld'
            : back.isV2Sushi
            ? 'V2SH_pendingOld'
            : ' _pendingOld',
          '|',
          back.hash
        );
    });
  } catch (e: any) {
    _log.error('pendingOld ', e.message);
  }
  return;
};

const pendingToDropped = async (back: any, message: string) => {
  try {
    await models.txM.pending.deleteOne({hash: back.hash});
  } catch (e: any) {
    _log.error('pendingToDropped ', e.message);
  }
  try {
    const timestampTx = nowMs();
    new models.g.trash({
      ...back,
      status: 'dropped',
      timestampTx,
      notes: {
        message,
        timestampTx,
      },
    }).save((e: any) => {
      if (!e)
        _log.success(
          back.isV2
            ? 'V2_Dropped'
            : back.isV3
            ? 'V3_Dropped'
            : back.isV2Sushi
            ? 'V2SH_Dropped'
            : ' _Dropped',
          '|',
          back.hash
        );
    });
  } catch (e: any) {
    _log.error('pendingToDropped ', e.message);
  }
  return;
};

const pendingToFailed = async (back: any, tx: any, message: string) => {
  try {
    await models.txM.pending.deleteOne({hash: back.hash});
  } catch (e: any) {
    _log.error('pendingToFailed ', e.message);
  }
  try {
    const timestampTx = nowMs();
    new models.g.trash({
      ...back,
      ...tx,
      timestampTx,
      status: 'failed',
      notes: {
        message,
        timestampTx,
      },
    }).save((e: any) => {
      if (!e)
        _log.success(
          back.isV2
            ? 'V2_Failed'
            : back.isV3
            ? 'V3_Failed'
            : back.isV2Sushi
            ? 'V2SH_Failed'
            : ' Failed',
          '|',
          back.hash
        );
    });
  } catch (e: any) {
    _log.error('pendingToFailed ', e.message);
  }
  return;
};

const pendingToConfirm = async (back: any, tx: any, message: string) => {
  try {
    await models.txM.pending.deleteOne({hash: back.hash});
  } catch (e: any) {
    _log.error('pendingToConfirm ', e.message);
  }
  try {
    const timestampTx = nowMs();
    new models.txM.confirmed({
      ...back,
      ...tx,
      timestampTx,
      status: 'confirmed',
      notes: {
        message,
        timestampTx,
      },
    }).save((e: any) => {
      if (!e)
        _log.success(
          back.isV2
            ? 'V2_Confirmed'
            : back.isV3
            ? 'V3_Confirmed'
            : back.isV2Sushi
            ? 'V2SH_Confirmed'
            : ' _Confirmed',
          '|',
          back.hash
        );
    });
  } catch (e: any) {
    _log.error('pendingToConfirm ', e.message);
  }
  return;
};

const createConfirm = async (tx: any, message: string) => {
  try {
    const timestampTx = nowMs();
    new models.txM.confirmed({
      ...tx,
      timestampTx,
      status: 'confirmed',
      notes: {
        message,
        timestampTx,
      },
    }).save((e: any) => {
      if (!e)
        _log.success(
          'createConfirm',
          tx.isV2
            ? 'V2_Confirmed'
            : tx.isV3
            ? 'V3_Confirmed'
            : tx.isV2Sushi
            ? 'V2SH_Confirmed'
            : ' _Confirmed',
          '|',
          tx.hash
        );
    });
  } catch (e: any) {
    _log.error('createConfirm ', e.message);
  }
  return;
};

const trashToconfirm = async (back: any, tx: any, message: string) => {
  try {
    await models.g.trash.deleteOne({hash: back.hash});
  } catch (e: any) {
    _log.error('trashToconfirm ', e.message);
  }
  try {
    const timestampTx = nowMs();
    new models.txM.confirmed({
      ...back,
      ...tx,
      timestampTx,
      status: 'confirmed',
      notes: {
        message,
        timestampTx,
      },
    }).save((e: any) => {
      if (!e)
        _log.success(
          'trashToconfirm',
          back.isV2
            ? 'V2_Confirmed'
            : back.isV3
            ? 'V3_Confirmed'
            : back.isV2Sushi
            ? 'V2SH_Confirmed'
            : ' _Confirmed',
          '|',
          back.hash
        );
    });
  } catch (e: any) {
    _log.error('trashToconfirm ', e.message);
  }
  return;
};

export {
  trashToconfirm,
  pendingToConfirm,
  pendingToFailed,
  pendingToDropped,
  createConfirm,
  pendingOld,
};
