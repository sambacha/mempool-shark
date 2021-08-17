import {startMongo, models} from '../mongo/config';
import {_log} from '../configs/utils';

const serverName = 'dropTransactions';

startMongo(serverName).then(started => {
  if (started) {
    startServer();
  } else {
    _log.error('---> started ', serverName, started);
  }
});

const startServer = () => {
  _log.start('---> startServer ', serverName);
  start();
};

const start = async () => {
  _log.start(serverName);
  await models.txM.pending.collection.drop();

  await models.txM.confirmed.collection.drop();

  await models.g.hashes.collection.drop();
  await models.g.trash.collection.drop();
  _log.ready('done');
};
