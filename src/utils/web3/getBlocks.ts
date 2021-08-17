import {get} from 'https';
import {mainWsComm} from './providers';
import {_log} from '../configs/utils';

const getBlock = async (number: number, provider: any) => {
  try {
    const block = await getFromBackupProviders(number, provider);
    return block;
  } catch (e: any) {
    _log.error('getBlock catch', number, e.message);
  }
};

const getFromBackupProviders = async (number: number, provider: any) => {
  try {
    const blockResponse = await goGetIt(provider, number);
    if (blockResponse) {
      return blockResponse;
    }
  } catch (e: any) {
    if (e.message === 'noNetwork') {
      const blockResponse = await goGetIt(mainWsComm, number);
      if (blockResponse) {
        return blockResponse;
      }
    }
  }
  return null;
};

const goGetIt = async (provider: any, number: number) => {
  try {
    const _blockResponse = await provider.getBlock(number);
    if (_blockResponse) return _blockResponse;
  } catch (e: any) {
    throw new Error(e.event);
  }
  return null;
};

async function getBlockInfo(url: string, opts: any): Promise<any> {
  return new Promise(resolve => {
    get(url, opts, res => {
      if (res) {
        let body = '';

        res.on('error', (e: any) => {
          _log.error(e.message);
          resolve(null);
        });

        res.on('data', chunk => {
          body += chunk;
        });

        res.on('end', () => {
          const responseData = JSON.parse(body);
          if (responseData) resolve(responseData);
          else resolve(null);
        });
      }
    }).on('error', (e: any) => {
      _log.error('Get getBlockInfo on error', e.message);
      resolve(null);
    });
  });
}

export {getBlockInfo, getBlock};
