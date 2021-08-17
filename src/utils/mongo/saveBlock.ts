import {_log} from '../configs/utils';
import {models} from './config';

const {g} = models;

const saveBlock = async (doc: any) => {
  try {
    new g.blocks({...doc, fullyUpdated: false}).save((e: any) => {
      if (e) _log.error('savedBlock error ', e.message);
    });
  } catch (e: any) {
    _log.error('not saveBlock', e);
  }
  return;
};

const updateBlock = async (blockHash: any, blockNumber: any, newData: any) => {
  try {
    g.blocks.updateOne(
      {blockHash},
      {...newData, fullyUpdated: true},
      {},
      (e: any) => {
        if (!e) _log.success('updatedBlock OK ', blockNumber);
      }
    );
  } catch (e: any) {
    _log.error('not updatedBlock', e);
  }
  return;
};

export {saveBlock, updateBlock};
