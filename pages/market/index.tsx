import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { PageHeader } from 'components/PageHeader';
import { apiPost } from 'utils/apiUtil';
import { BuyOrder, BuyOrderMatch, MarketOrder, SellOrder } from '@infinityxyz/lib/types/core';
import { Button } from '@chakra-ui/button';
import { BuyOrderList, BuyOrderMatchList, SellOrderList } from './MarketList';

// TODO: move these types to the lib
export type OrderType = 'sellOrders' | 'buyOrders';
export type ActionType = 'list' | 'add' | 'delete' | 'move';
export type ListIdType = 'validActive' | 'validInactive' | 'invalid';

interface MarketListingsBody {
  orderType: OrderType;
  action: ActionType;
  listId?: ListIdType;
  moveListId?: ListIdType;
}

interface MarketListingsResponse {
  result: MarketOrder[];
  error: string;
}

const MarketPage = (): JSX.Element => {
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [matchOrders, setMatchOrders] = useState<BuyOrderMatch[]>([]);
  const { user, chainId, showAppError, showAppMessage } = useAppContext();

  const buy = async (order: BuyOrder) => {
    const body = {
      buyOrder: order
    };

    const response = await apiPost(`/u/${user?.account}/market`, null, body);

    const match = response.result.result as BuyOrderMatch;

    console.log(match);

    if (response.status === 200) {
      if (match) {
        setMatchOrders([match]);

        showAppMessage('buy successful.');
      } else {
        showAppMessage('buy submitted');
      }
    } else {
      showAppError('An error occured: buy');
    }
  };

  const list = async (body: MarketListingsBody) => {
    const response = await apiPost(`/marketListings`, null, body);

    const match: MarketListingsResponse | null = response.result;

    if (response.status === 200) {
      if (match) {
        if (body.orderType === 'buyOrders') {
          const buys: BuyOrder[] = match.result as BuyOrder[];

          setBuyOrders(buys);
        } else if (body.orderType === 'sellOrders') {
          const sells: SellOrder[] = match.result as SellOrder[];

          setSellOrders(sells);
        }

        showAppMessage('list successful.');
      } else {
        showAppMessage('list ??');
      }
    } else {
      showAppError('An error occured: buy');
    }
  };

  const sell = async (order: SellOrder) => {
    const body = {
      sellOrder: order
    };

    const response = await apiPost(`/u/${user?.account}/market`, null, body);

    const match = response.result.result as BuyOrderMatch[];

    console.log(match);

    if (response.status === 200) {
      if (match) {
        setMatchOrders(match);
        showAppMessage('sell successful.');
      } else {
        showAppMessage('sell submitted');
      }
    } else {
      showAppError('An error occured: sell');
    }
  };

  const buttons = (
    <div className={styles.buttons}>
      <Button
        onClick={() => {
          const order: BuyOrder = {
            user: user?.account ?? '',
            budget: 12,
            collectionAddresses: ['apes', 'goop'],
            expiration: Date.now() + 10000,
            minNFTs: 2,
            chainId: chainId
          };

          buy(order);
        }}
      >
        Buy
      </Button>

      <Button
        onClick={() => {
          const order: BuyOrder = {
            user: user?.account ?? '',
            budget: 22,
            collectionAddresses: ['apes', 'goop'],
            expiration: Date.now() + 10000,
            minNFTs: 4,
            chainId: chainId
          };

          buy(order);
        }}
      >
        Buy2
      </Button>

      <Button
        onClick={() => {
          let order: SellOrder = {
            user: user?.account ?? '',
            collectionAddress: 'goop',
            collectionName: 'goop',
            expiration: Date.now() + 10000,
            tokenId: '0xalddsdfsdflsdfkasfsfsjasdlf',
            tokenName: 'Pink Cat',
            price: 1.2,
            chainId: chainId
          };

          sell(order);

          order = {
            user: user?.account ?? '',
            collectionAddress: 'apes',
            collectionName: 'apes',
            expiration: Date.now() + 10000,
            tokenId: '0xalddsdfsdflsdfkasjdlfkjasdlf',
            tokenName: 'Green Cat',
            price: 1.2,
            chainId: chainId
          };

          sell(order);
        }}
      >
        Sell
      </Button>

      <Button
        onClick={() => {
          let order: SellOrder = {
            user: user?.account ?? '',
            collectionAddress: 'goop',
            collectionName: 'goop',
            expiration: Date.now() + 10000,
            tokenId: '0xaldfsfsflsdfkasjdlfkjasdlf',
            tokenName: 'Blue Cat',
            price: 1.2,
            chainId: chainId
          };

          sell(order);

          order = {
            user: user?.account ?? '',
            collectionAddress: 'apes',
            collectionName: 'apes',
            expiration: Date.now() + 10000,
            tokenId: '0xalddssdsdfkasjdlfkjasdlf',
            tokenName: 'Purple Cat',
            price: 1.2,
            chainId: chainId
          };

          sell(order);
        }}
      >
        Sell2
      </Button>

      <Button
        onClick={() => {
          const body: MarketListingsBody = {
            orderType: 'sellOrders',
            action: 'list',
            listId: 'validActive',
            moveListId: 'validActive'
          };

          list(body);
        }}
      >
        Sell Orders
      </Button>

      <Button
        onClick={() => {
          const body: MarketListingsBody = {
            orderType: 'buyOrders',
            action: 'list',
            listId: 'validActive',
            moveListId: 'validActive'
          };

          list(body);
        }}
      >
        Buy Orders
      </Button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Market</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <PageHeader title="Market" />
          <PleaseConnectWallet account={user?.account} />

          {buttons}
          <div>Buy Orders</div>
          <BuyOrderList orders={buyOrders} onClickAction={(order) => console.log('clicked')} />

          <div>Sell Orders</div>
          <SellOrderList orders={sellOrders} onClickAction={(order) => console.log('clicked')} />

          <div>Sell Orders</div>

          <BuyOrderMatchList
            matches={matchOrders}
            onBuyClick={(order) => console.log('clicked')}
            onSellClick={(order) => console.log('clicked')}
          />
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
MarketPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default MarketPage;
