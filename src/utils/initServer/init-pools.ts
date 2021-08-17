import {ethers} from 'ethers';
import {models, startMongo} from '../mongo/config';
import {checksum, nowMs, timeout, _log} from '../configs/utils';
import {mainWsComm} from '../web3/providers';
import {savePools} from '../mongo/savePools';

const serverName = 'initPools';
const {g} = models;

const factoryv2 = checksum('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
const factoryv3 = checksum('0x1F98431c8aD98523631AE4a59f267346ea31F984');
const factoryv2sh = checksum('0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac');
const poolCreated = ethers.utils.id(
  'PoolCreated(address,address,uint24,int24,address)'
);
const pairCreated = ethers.utils.id(
  'PairCreated(address,address,address,uint256)'
);

const startServer = () => {
  _log.start('---> startServer ', serverName);
  startAddPools();
};

startMongo(serverName).then(started => {
  if (started) {
    startServer();
  } else {
    _log.error('---> started ', serverName, started);
  }
});

const startAddPoolsGet = async (
  fromBlock: any,
  lastBlock: any,
  dex: string,
  factory: any,
  filterTopics: any
) => {
  try {
    _log.info(
      'startAddPoolsGet fromBlock lastBlock dex',
      fromBlock,
      lastBlock,
      dex
    );
    const toBlock = fromBlock + 100000;
    const filter = {
      address: factory,
      fromBlock,
      toBlock: toBlock >= lastBlock ? 'latest' : toBlock,
      topics: [filterTopics],
    };
    const result = await mainWsComm.getLogs(filter);

    if (result)
      for (const r of result) {
        const data = r.data;
        const topics = r.topics;
        const t0 = checksum('0x' + topics[1].slice(66 - 40, 112));
        const t1 = checksum('0x' + topics[2].slice(66 - 40, 112));
        const address = checksum('0x' + data.slice(130 - 40, 130));
        const v2Address = checksum('0x' + data.slice(26, 66));
        const transactionHash = r.transactionHash;
        const p = {
          address: dex === 'v3' ? address : v2Address,
          hashAddress: dex === 'v3' ? address : v2Address,
          t0,
          t1,
          transactionHash,
          timestampTx: nowMs(),
          blockNumber: r.blockNumber,
          isV3: dex === 'v3',
          isV2: dex === 'v2',
          isV2Sushi: dex === 'v2sh',
        };
        savePools(p);
        await timeout(10);
      }
    if (toBlock <= lastBlock) {
      await startAddPoolsGet(toBlock, lastBlock, dex, factory, filterTopics);
    } else {
      _log.ready('startAddPoolsGet DONE', toBlock, lastBlock, dex);
    }
  } catch (e) {
    _log.error(e);
  }
  return;
};

const startAddPools = async () => {
  try {
    const lastBlock = await mainWsComm.getBlockNumber();

    const pv2 = await g.pools.findOne({isV2: true}, null, {
      sort: {blockNumber: -1},
    });
    const pv3 = await g.pools.findOne({isV3: true}, null, {
      sort: {blockNumber: -1},
    });
    const pv2sh = await g.pools.findOne({isV2Sushi: true}, null, {
      sort: {blockNumber: -1},
    });

    let iv2 = 10000835;
    let iv3 = 12369621;
    let iv2sh = 10794229;

    if (pv2) {
      iv2 = pv2.blockNumber;
    }
    if (pv3) {
      iv3 = pv3.blockNumber;
    }
    if (pv2sh) {
      iv2sh = pv2sh.blockNumber;
    }

    await startAddPoolsGet(iv3, lastBlock, 'v3', factoryv3, poolCreated);
    await startAddPoolsGet(iv2, lastBlock, 'v2', factoryv2, pairCreated);
    await startAddPoolsGet(iv2sh, lastBlock, 'v2sh', factoryv2sh, pairCreated);
  } catch (e) {
    _log.error(e);
  }
};

export {startAddPools as fetchNewPools};
