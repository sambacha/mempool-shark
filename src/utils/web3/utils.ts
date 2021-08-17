const MAINNET = 1;
const _WETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const _ETH_ADDRESS = '0x0000000000000000000000000000000000000000';

const _MULTICALL = 'multicall';

const _V3_FUNC_ALLOWED_METHODS = new Array<string>(
  'multicall',
  'exactInputSingle',
  'exactInput',
  'exactOutputSingle',
  'exactOutput'
);

//Same Order
const _V3_FNAME_ONLY_SWAP = new Array<string>(
  'exactInputSingle',
  'exactInput',
  'exactOutputSingle',
  'exactOutput'
);
const _V3_SIGS_ONLY_SWAP = new Array<string>(
  '0x414bf389',
  '0xc04b8d59',
  '0xdb3e2198',
  '0xf28c0498'
);

const V3_SWAP_FNAME = {
  EIS: 'exactInputSingle',
  EI: 'exactInput',
  EOS: 'exactOutputSingle',
  EO: 'exactOutput',
};

const V3_SWAP_SIGS = {
  exactInputSingleSig: '0x414bf389',
  exactInputSig: '0xc04b8d59',
  exactOutputSingleSig: '0xdb3e2198',
  exactOutputSig: '0xf28c0498',
};

export {
  V3_SWAP_SIGS,
  V3_SWAP_FNAME,
  _V3_SIGS_ONLY_SWAP,
  _V3_FNAME_ONLY_SWAP,
  _V3_FUNC_ALLOWED_METHODS,
  _MULTICALL,
  _ETH_ADDRESS,
  _WETH_ADDRESS,
  MAINNET,
};
