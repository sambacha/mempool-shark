import {checksum, nowMs, _log} from '../configs/utils';
import {models} from './config';

const {g} = models;

const saveWhale = async (whale: any) => {
  try {
    const w = {
      address: checksum(whale.address),
      hashAddress: checksum(whale.address),
      twitter: whale.twitter.twitter,
      timestampTx: nowMs(),
    };

    new g.whales(w).save((e: any, doc: any) => {
      if (!e) _log.success('savedWhale', doc.address);
    });
  } catch (e) {
    _log.error('not savedWhale', e.message);
  }
  return;
};

export {saveWhale};
