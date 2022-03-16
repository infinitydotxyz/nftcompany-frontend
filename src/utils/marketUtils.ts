import { apiPost } from 'utils/apiUtil';
import {
  BuyOrder,
  BuyOrderMatch,
  CollectionAddress,
  MarketListingsBody,
  MarketListingsResponse,
  MarketOrder,
  SellOrder,
  TradeBody,
  TradeResponse
} from '@infinityxyz/lib/types/core';

export const addBuy = async (order: BuyOrder): Promise<BuyOrderMatch[]> => {
  try {
    const body: TradeBody = {
      buyOrder: order
    };

    const response = await apiPost(`/u/${order.user}/market`, null, body);

    if (response.result) {
      const res: TradeResponse | null = response.result;

      if (res && response.status === 200) {
        return res.matches;
      }
    }
  } catch (err) {
    console.log(err);
  }

  return [];
};

export const addSell = async (order: SellOrder): Promise<BuyOrderMatch[]> => {
  try {
    const body: TradeBody = {
      sellOrder: order
    };

    const response = await apiPost(`/u/${order.user}/market`, null, body);
    if (response.result) {
      const res: TradeResponse | null = response.result;

      if (res && response.status === 200) {
        return res.matches;
      }
    }

    console.log('An error occured: sell');
  } catch (err) {
    console.log(err);
  }

  return [];
};

export const marketBuyOrders = async (): Promise<MarketOrder[]> => {
  const body: MarketListingsBody = {
    orderType: 'buyOrders',
    action: 'list',
    listId: 'validActive',
    moveListId: 'validActive'
  };

  return list(body);
};

export const marketSellOrders = async (): Promise<MarketOrder[]> => {
  const body: MarketListingsBody = {
    orderType: 'sellOrders',
    action: 'list',
    listId: 'validActive',
    moveListId: 'validActive'
  };

  return list(body);
};

const list = async (body: MarketListingsBody): Promise<MarketOrder[]> => {
  const response = await apiPost(`/marketListings`, null, body);

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (response.status === 200) {
      if (match) {
        if (body.orderType === 'buyOrders') {
          const buys: BuyOrder[] = match.buyOrders as BuyOrder[];

          return buys;
        } else if (body.orderType === 'sellOrders') {
          const sells: SellOrder[] = match.sellOrders as SellOrder[];

          return sells;
        }
      }
    }
  }
  console.log('An error occured: buy');
  return [];
};

export const marketMatches = async (): Promise<BuyOrderMatch[]> => {
  const body: MarketListingsBody = {
    action: 'match',
    orderType: 'buyOrders'
  };

  const response = await apiPost(`/marketListings`, null, body);

  if (response.result) {
    const res: MarketListingsResponse | null = response.result;

    if (res && response.status === 200) {
      return res.matches;
    }
  }
  console.log('An error occured: matches');

  return [];
};

export const marketDeleteOrder = async (body: MarketListingsBody): Promise<string> => {
  const response = await apiPost(`/marketListings`, null, body);

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (response.status === 200) {
      if (match) {
        return match.success;
      }
    }
  }

  console.log('An error occured: buy');

  return 'error';
};

export const executeBuyOrder = async (orderId: string): Promise<string> => {
  const body: MarketListingsBody = {
    action: 'buy',
    orderId: orderId,
    orderType: 'buyOrders'
  };

  const response = await apiPost(`/marketListings`, null, body);

  if (response.result) {
    const match: MarketListingsResponse | null = response.result;

    if (response.status === 200) {
      if (match) {
        return match.success;
      }
    }
  }

  console.log('An error occured: buy');

  return 'error';
};

// ======================================================

const collectionMap = new Map<string, CollectionAddress>();
collectionMap.set('0xAddress1', { address: '0xAddress1', name: 'Dump Trux' });
collectionMap.set('0xAddress2', { address: '0xAddress2', name: 'Ape People' });
collectionMap.set('0xAddress3', { address: '0xAddress3', name: 'DigiKraap' });
collectionMap.set('0xAddress4', { address: '0xAddress4', name: 'Sik Art' });
collectionMap.set('0xAddress5', { address: '0xAddress5', name: 'Blu Balz' });
collectionMap.set('0xAddress6', { address: '0xAddress6', name: 'Unkle Fester' });
collectionMap.set('0xAddress7', { address: '0xAddress7', name: 'Badass Pix' });

export class CollectionManager {
  static collections = (): CollectionAddress[] => Array.from(collectionMap.values());
}
