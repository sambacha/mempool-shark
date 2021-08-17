import {_log} from '../configs/utils';
import {models} from './config';

const {g} = models;

const savePools = async (data: any) => {
  try {
    new g.pools(data).save((e: any, doc: any) => {
      //if (!e) _log.success('savedPools', doc.address);
    });
  } catch (e) {
    _log.error('savedPools', e.message);
  }
  return;
};

export {savePools};
