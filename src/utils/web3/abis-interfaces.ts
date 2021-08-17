import {Interface} from '@ethersproject/abi';
import SushiV2Router from '@sushiswap/core/build/abi/IUniswapV2Router02.json';
import {abi as UniV2Router} from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import {abi as UniV3Router} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json';
import {abi as IUniswapV3PoolABI} from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import {abi as IUniswapV2PairABI} from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import {abi as _erc20abi} from '@uniswap/v2-core/build/ERC20.json';
import {abi as _multicallabi} from '../../abis/Multicall2.json';

export const erc20abi = _erc20abi;
export const multicallabi = _multicallabi;
export const iUniV2Router = new Interface(UniV2Router);
export const iUniV3Router = new Interface(UniV3Router);
export const iSushiV2Router = new Interface(SushiV2Router);
export const iUniswapV3PoolABI = new Interface(IUniswapV3PoolABI);
export const iUniswapV2PairABI = new Interface(IUniswapV2PairABI);
