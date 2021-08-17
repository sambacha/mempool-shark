import {Socket} from 'socket.io';
import {
  startSocketServer,
  explorerNS,
  emmitChange,
  getAddressFilter,
  getSpaceFilter,
} from './utils/_websocket/utils';
import {startMongo, mongoUtils, models} from './utils/mongo/config';
import {_log} from './utils/configs/utils';

const {UPDATE_ONLY, INSERT_ONLY, FIRST_QUERY, INS_PEND, DEL_PEND, INS_CONF} =
  mongoUtils;
const {txM, g} = models;
const serverName = 'web';

let lastBlockNumber = 0;
let usersCount = 0;

startMongo(serverName).then(started => {
  if (started) {
    startSocketServer(serverName).then(startedSocket => {
      if (startedSocket) {
        _log.start('startRooms Go!');
        startRooms();
        _log.start('startWatchers Go!');
        startWatchers();
      } else {
        _log.warn('---> startedSocket ', startedSocket);
      }
    });
  } else {
    _log.warn('---> started ', started);
  }
});

const startRooms = () => {
  explorerNS.on('connection', async (socket: Socket<any>) => {
    usersCount++;
    _log.info('------> Connected!    = Count =', usersCount);

    joinToBlocks(socket);
    joinToAddress(socket);

    socket.on('disconnect', () => {
      usersCount--;
      _log.info('<------ Disconnected! = Count =', usersCount);
    });
  });
};

const startWatchers = () => {
  watchBlocks();
  watchTrashTxs();
  watchPendingTxs();
  watchConfirmedTxs();
};

const watchTrashTxs = () => {
  g.trash.watch(INSERT_ONLY).on('change', (data: any) => {
    emmitChange(DEL_PEND, data.fullDocument);
  });
};

const watchPendingTxs = () => {
  txM.pending.watch(INSERT_ONLY).on('change', (data: any) => {
    emmitChange(INS_PEND, data.fullDocument);
  });
};

const watchConfirmedTxs = () => {
  txM.confirmed.watch(INSERT_ONLY).on('change', (data: any) => {
    const {fullDocument} = data;
    emmitChange(DEL_PEND, fullDocument);
    emmitChange(INS_CONF, fullDocument);
  });
};

const watchBlocks = () => {
  g.blocks.watch(UPDATE_ONLY).on('change', async (data: any) => {
    const {_doc} = await g.blocks.findById(data.documentKey._id);
    const {fullyUpdated, blockNumber} = _doc;

    if (fullyUpdated === true) {
      lastBlockNumber = blockNumber;
      explorerNS.emit('new_block', _doc);
    }
  });
};

const joinToBlocks = (socket: Socket<any>) => {
  socket.on('join_to_blocks', async () => {
    try {
      const {id} = socket;
      const {_doc} = await g.blocks.findOne({fullyUpdated: true}, null, {
        sort: {timestampTx: -1},
      });
      console.log('_doc', _doc);
      if (_doc) explorerNS.to(id).emit('last_block', _doc);
    } catch (e: any) {
      _log.error('join_to_blocks catch', e);
    }
  });
};

const joinToAddress = (socket: Socket<any>) => {
  socket.on('join_to_address', async (request: any) => {
    const {id} = socket;
    for (const room of socket.rooms) if (room !== id) socket.leave(room);

    const {address, dexSpaces} = request;
    const _or_from_to = getAddressFilter(address);
    const _or_filter_dexes = getSpaceFilter(dexSpaces);

    const query = {
      $and: [_or_from_to, _or_filter_dexes],
    };

    txM.pending.find(query, null, FIRST_QUERY, (e, docs) => {
      if (!e) explorerNS.to(id).emit('pending_txs', docs);
    });
    txM.confirmed.find(query, null, FIRST_QUERY, (e, docs) => {
      if (!e) explorerNS.to(id).emit('confirmed_txs', docs);
    });

    try {
      const {isV2, isV3, isV2Sushi} = dexSpaces;
      isV2 && socket.join(address + 'v2');
      isV3 && socket.join(address + 'v3');
      isV2Sushi && socket.join(address + 'v2sh');
    } catch (e: any) {
      _log.warn('---> dexSpaces join catch', e);
    }
  });
};
