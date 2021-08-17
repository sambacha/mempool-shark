import {providers} from 'ethers';
import {KEYS, _log} from '../configs/utils';

const network = {
  name: 'homestead',
  chainId: 1,
};

const {
  INFURA_KEY1,
  INFURA_KEY2,
  INFURA_KEY3,
  INFURA_KEY4,
  ALCHEMY_KEY1,
  ALCHEMY_KEY2,
  ETHERSCAN_KEY1,
  ETHERSCAN_KEY2,
  POKT_KEY,
  GET_BLOCK_KEY,
  MAIN_WS,
} = KEYS;

const {WebSocketProvider, EtherscanProvider, StaticJsonRpcProvider} = providers;

const MAIN_WS_PROVIDER = new WebSocketProvider(MAIN_WS, network);
const mainWsLMem = new WebSocketProvider(
  'wss://mainnet.infura.io/ws/v3/' + INFURA_KEY1,
  network
);
const mainWsComm = new WebSocketProvider(
  'wss://mainnet.infura.io/ws/v3/' + INFURA_KEY2,
  network
);
const mainWsLConf = new WebSocketProvider(
  'wss://mainnet.infura.io/ws/v3/' + INFURA_KEY3,
  network
);

const mainWsExtra = new WebSocketProvider(
  'wss://mainnet.infura.io/ws/v3/' + INFURA_KEY4,
  network
);

const alcheWs1 = new WebSocketProvider(
  'wss://eth-mainnet.alchemyapi.io/v2/' + ALCHEMY_KEY1,
  network
);
const alcheWs2 = new WebSocketProvider(
  'wss://eth-mainnet.alchemyapi.io/v2/' + ALCHEMY_KEY2,
  network
);

const escan1 = new EtherscanProvider(network, ETHERSCAN_KEY1);
const escan2 = new EtherscanProvider(network, ETHERSCAN_KEY2);

const linkpool = new WebSocketProvider(
  'wss://api.zmok.io/mainnet/8ylcxy8gvmbuhipq',
  network
);
const linkpool2 = new WebSocketProvider(
  'wss://api.zmok.io/mainnet/v1cuawrr6xgfrx1r',
  network
);
const getblock = new WebSocketProvider(
  'wss://eth.getblock.io/mainnet/?api_key=' + GET_BLOCK_KEY,
  network
);
const pokt = new StaticJsonRpcProvider(
  'https://eth-mainnet.gateway.pokt.network/v1/lb/' + POKT_KEY,
  network
);

const providersForLM: Array<any> = [
  mainWsLMem,
  mainWsExtra,
  alcheWs1,
  linkpool,
];
const providersForLC: Array<any> = [
  mainWsLConf,
  mainWsLConf,
  alcheWs2,
  linkpool2,
];

export {
  providersForLM,
  providersForLC,
  mainWsComm,
  escan1,
  escan2,
  MAIN_WS_PROVIDER,
};
