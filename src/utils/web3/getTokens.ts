import {WETH9} from '@uniswap/sdk-core';
import {Token} from '@uniswap/sdk-core';
import {Token as TokenSushi, WETH} from '@sushiswap/sdk';
import {checksum, _log} from '../configs/utils';
import {MAINNET, _WETH_ADDRESS, _ETH_ADDRESS} from '../../utils/web3/utils';
import {getContractData} from './getContractData';
import {models} from '../mongo/config';
import {saveToken, updateToken} from '../mongo/saveToken';

const newTokenUni = (data: any): Token | null => {
  try {
    if (data)
      return new Token(
        MAINNET,
        checksum(data.address),
        data.decimals,
        data.symbol,
        data.name
      );
  } catch (e: any) {}
  return null;
};

const newTokenSushi = (data: any): TokenSushi | null => {
  try {
    if (data)
      return new TokenSushi(
        MAINNET,
        checksum(data.address),
        Number(data.decimals),
        data.symbol,
        data.name
      );
  } catch (e: any) {
    _log.warn('newTokenSushi catch', data);
  }
  return null;
};

const getTokens = async (
  checkedPath: Array<string>,
  pName: string,
  dexSpace: string,
  providers: Array<any>
) => {
  try {
    if (checkedPath && pName && dexSpace) {
      const tks = [];

      for (const address of checkedPath) {
        if (!address) {
          _log.warn('getTokens bad checkedPath??', checkedPath);
          return null;
        } else if (address === _WETH_ADDRESS || address === _ETH_ADDRESS) {
          if (dexSpace === 'v2sh') tks.push(WETH[MAINNET]);
          else tks.push(WETH9[MAINNET]);
        } else {
          const t = await models.g.tokens.findOne({address}, null, {});

          if (!t) {
            const contractToken = await getContractData(address, providers);
            if (contractToken) {
              if (dexSpace === 'v2sh') {
                tks.push(newTokenSushi(contractToken));
              } else {
                tks.push(newTokenUni(contractToken));
              }
              saveToken(contractToken, pName, dexSpace);
            }
          } else {
            const tokenData = t._doc;

            if (dexSpace === 'v2sh') {
              tks.push(newTokenSushi(tokenData));
              if (tokenData.isV2Sushi === false) {
                updateToken(tokenData, pName, dexSpace);
              }
            }
            if (dexSpace === 'v2') {
              tks.push(newTokenUni(tokenData));
              if (tokenData.isV2 === false) {
                updateToken(tokenData, pName, dexSpace);
              }
            }

            if (dexSpace === 'v3') {
              tks.push(newTokenUni(tokenData));
              if (tokenData.isV3 === false) {
                updateToken(tokenData, pName, dexSpace);
              }
            }
          }
        }
      }
      if (tks.length === checkedPath.length) {
        return tks;
      } else {
        _log.warn(
          'getTokens tks.length === checkedPath.length',
          tks.length === checkedPath.length
        );
      }
    } else {
      _log.error('getTokens data error', checkedPath, pName, dexSpace);
    }
  } catch (e: any) {
    _log.error('getTokens catch', e.message);
  }
  return null;
};

export {getTokens, newTokenSushi, newTokenUni};
