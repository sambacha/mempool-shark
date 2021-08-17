import {get} from 'https';
import {timeout, TOKEN_LIST_ALL, _log} from '../configs/utils';
import {startMongo, models} from '../mongo/config';
import {saveToken} from '../mongo/saveToken';

const serverName = 'initTokens';
const dexSpace = 'all';

const startServer = () => {
  _log.start('---> startServer ', serverName);
  addTokens();
};

startMongo(serverName).then(started => {
  if (started) {
    startServer();
  } else {
    _log.error('---> started ', serverName, started);
  }
});

const addTokens = async () => {
  await models.g.tokens.deleteMany({}, {});

  const tokenCount = await models.g.tokens.countDocuments();
  _log.info('tokenCount', tokenCount);

  if (tokenCount > 0) {
    _log.warn('tokens not empty', tokenCount);
  } else {
    for (let l = 0; l < TOKEN_LIST_ALL.length; l++) {
      try {
        if (TOKEN_LIST_ALL[l] !== '') {
          _log.info('----------------------------------');
          _log.start('-getList ', TOKEN_LIST_ALL[l]);
          await getList(TOKEN_LIST_ALL[l]);
          _log.ready('-getList ', TOKEN_LIST_ALL[l]);
        } else {
          _log.warn('invalid list?', TOKEN_LIST_ALL[l]);
        }
      } catch (e) {
        _log.error(serverName, e.message);
      }
      await timeout(6000);
    }
  }
};

const getList = async (list: string): Promise<boolean> => {
  _log.info('starting getList');
  return new Promise(resolve => {
    get(list, res => {
      if (res) {
        let body = '';

        res.on('error', e => {
          _log.error('get res', serverName, e.message);
          resolve(true);
        });

        res.on('data', chunk => {
          body += chunk;
        });

        res.on('end', async () => {
          const tokenList = JSON.parse(body).tokens;
          for (const token of tokenList) {
            if (token && token.address) saveToken(token, serverName, dexSpace);
          }
          _log.info('resolved getList');
          resolve(true);
        });
      }
    }).on('error', e => {
      _log.error('getList', serverName, e.message);
      resolve(true);
    });
  });
};
