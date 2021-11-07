import {get} from 'https';
import {_log} from '../configs/utils';
import {startMongo} from '../mongo/config';
import {saveWhale} from '../mongo/saveWhale';

/**
* @note the 'whales' list is sourced from uniswap governance repo
* this repo actually overwrites its commits, so you can not by virtue of git history
* observe changes to this list. 
*/
const serverName = 'initWhales';
const URLData = 'https://raw.githubusercontent.com/Uniswap/sybil-list/master/verified.json';

const startServer = () => {
  _log.start('---> startServer ', serverName);
  startAddWhales();
};

startMongo(serverName).then(started => {
  if (started) {
    startServer();
  } else {
    _log.error('---> started ', serverName, started);
  }
});

const startAddWhales = () => {
  try {
    get(URLData, res => {
      if (res) {
        let body = '';

        res.on('error', e => {
          _log.warn(e.message);
        });

        res.on('data', chunk => {
          body += chunk;
        });

        res.on('end', () => {
          const whalesList = JSON.parse(body);
          const whalesArray = Object.entries(whalesList);

          for (const whale of whalesArray) {
            saveWhale({
              address: whale[0],
              twitter: whale[1],
            });
          }
        });
      }
    }).on('error', e => {
      _log.error(serverName, e.message);
    });
  } catch (e) {
    _log.error(serverName, e.message);
  }
};
