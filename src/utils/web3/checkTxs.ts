import {ENV, _log, nowMs} from '../configs/utils';
import {IContractSharkTx} from '../../models/TransactionSchema';
import {TransactionResponse} from '@ethersproject/abstract-provider';
import {Currency, Price} from '@uniswap/sdk-core';

const checkTx = (
  tx: TransactionResponse,
  whaleData: any,
  isV2: boolean,
  isV3: boolean,
  isV2Sushi: boolean
): IContractSharkTx => {
  return {
    ...tx,
    txHash: tx.hash,
    isV2,
    isV3,
    isV2Sushi,
    links: {etherscan: ENV.ES_TX + tx.hash},
    status: 'pending',
    timestampTx: nowMs(),
    whaleData,
  };
};

const getPrice = (price: Price<Currency, Currency>) => {
  return {
    priceFrom: price.toSignificant(6),
    priceFromInverted: price.invert().toSignificant(6),
    priceTo: price.invert().toSignificant(6),
    priceToInverted: price.toSignificant(6),
    label: `${price.baseCurrency.symbol} per ${price.quoteCurrency.symbol}`,
    labelInverted: `${price.quoteCurrency.symbol} per ${price.baseCurrency.symbol}`,
  };
};

export {getPrice, checkTx};
