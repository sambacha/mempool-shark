import {_log, checksum, nowMs} from '../configs/utils';
import {models} from './config';
import {_WETH_ADDRESS, _ETH_ADDRESS} from '../web3/utils';

const {g} = models;

async function saveToken(
  tokenData: any,
  by: string,
  dexSpace: string
): Promise<null> {
  try {
    const address = checksum(tokenData.address);
    const isGeneral = checkDex(dexSpace, 'all');
    const isV2 = isGeneral ? true : checkDex(dexSpace, 'v2');
    const isV2Sushi = isGeneral ? true : checkDex(dexSpace, 'v2sh');
    const isV3 = isGeneral ? true : checkDex(dexSpace, 'v3');

    const now = nowMs();

    const tokenDoc = {
      ...tokenData,
      address,
      hashAddress: address,
      by,
      isGeneral,
      isV2,
      isV3,
      isV2Sushi,
      timestampTx: now,
      msV3: isV3 ? now : null,
      msV2: isV2 ? now : null,
      msV2Sushi: isV2Sushi ? now : null,
    };
    delete tokenDoc._id;
    delete tokenDoc.__v;

    new g.tokens(tokenDoc).save((e: any) => {
      if (!e)
        _log.success('SAVED TOKEN || ', address, dexSpace, tokenDoc.symbol);
    });
  } catch (e: any) {
    _log.error('savedToken catch', tokenData, e);
  }
  return null;
}

async function updateToken(
  tokenData: any,
  by: string,
  dexSpace: string
): Promise<null> {
  try {
    const address = checksum(tokenData.address);
    const token = await g.tokens.findOne({address}, null, {});
    if (token) {
      const _doc = token._doc;
      const isGeneral = _doc.isGeneral ? true : checkDex(dexSpace, 'all');
      const isV2 = isGeneral
        ? true
        : _doc.isV2
        ? true
        : checkDex(dexSpace, 'v2');
      const isV3 = isGeneral
        ? true
        : _doc.isV3
        ? true
        : checkDex(dexSpace, 'v3');
      const isV2Sushi = isGeneral
        ? true
        : _doc.isV2Sushi
        ? true
        : checkDex(dexSpace, 'v2sh');

      const now = nowMs();

      const tokenDoc = {
        ..._doc,
        ...tokenData,
        by,
        isGeneral,
        isV2,
        isV3,
        isV2Sushi,
        msV3: isV3 ? (_doc.msV3 ? _doc.msV3 : now) : null,
        msV2: isV2 ? (_doc.msV2 ? _doc.msV2 : now) : null,
        msV2Sushi: isV2Sushi ? (_doc.msV2Sushi ? _doc.msV2Sushi : now) : null,
      };
      delete tokenDoc._id;

      g.tokens.updateOne({address}, {...tokenDoc}, {}, (e: any) => {
        if (!e)
          _log.success('UPDATED TOKEN || ', address, dexSpace, tokenDoc.symbol);
      });
    }
  } catch (e: any) {
    _log.error('tokens.updateOne catch', tokenData, e);
  }
  return null;
}

const checkDex = (dexSpace: string, checkTo: string): boolean => {
  try {
    return dexSpace === checkTo;
  } catch (e: any) {
    _log.error('checkDex', e.message);
  }
  return false;
};

export {saveToken, updateToken};
