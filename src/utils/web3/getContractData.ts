import {ethers} from 'ethers';
import {checksum, getRandomInt, _log} from '../configs/utils';
import {erc20abi} from './abis-interfaces';
import {MAINNET} from './utils';

const getContractData = async (
  contractAddress: string,
  providers: Array<any>
): Promise<any> => {
  try {
    const address = checksum(contractAddress);

    const contract = new ethers.Contract(
      address,
      erc20abi,
      providers[getRandomInt(1, providers.length - 1)]
    );

    const [decimals, name, symbol] = await Promise.all([
      contract.functions.decimals(),
      contract.functions.name(),
      contract.functions.symbol(),
    ]);

    return {
      chainId: MAINNET,
      address,
      decimals: decimals[0],
      name: name[0],
      symbol: symbol[0],
    };
  } catch (e: any) {
    _log.error('GetContractData catch', contractAddress, e);
  }
  return null;
};

export {getContractData, MAINNET};
