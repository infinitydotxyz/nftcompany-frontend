import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { PageHeader } from 'components/PageHeader';
import { apiPost } from 'utils/apiUtil';
import {
  BuyOrder,
  BuyOrderMatch,
  MarketListingsBody,
  MarketListingsResponse,
  MarketOrder,
  SellOrder,
  isBuyOrder,
  orderHash
} from '@infinityxyz/lib/types/core';
import { Button } from '@chakra-ui/button';
import { BuyOrderList, BuyOrderMatchList, SellOrderList } from './MarketList';

const expirationTime = Date.now() + 10000;

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

    if (response.result) {
      const match = response.result.result as BuyOrderMatch;

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
    }
  };

  const listBuyOrders = async () => {
    const body: MarketListingsBody = {
      orderType: 'buyOrders',
      action: 'list',
      listId: 'validActive',
      moveListId: 'validActive'
    };

    list(body);
  };

  const listSellOrders = async () => {
    const body: MarketListingsBody = {
      orderType: 'sellOrders',
      action: 'list',
      listId: 'validActive',
      moveListId: 'validActive'
    };

    list(body);
  };

  const list = async (body: MarketListingsBody) => {
    const response = await apiPost(`/marketListings`, null, body);

    if (response.result) {
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
    }
  };

  const deleteOrder = async (body: MarketListingsBody) => {
    const response = await apiPost(`/marketListings`, null, body);

    if (response.result) {
      const match: MarketListingsResponse | null = response.result;

      if (response.status === 200) {
        if (match) {
          showAppMessage(match.success);
        } else {
          showAppMessage('list ??');
        }
      } else {
        showAppError('An error occured: buy');
      }
    }
  };

  const sell = async (order: SellOrder) => {
    const body = {
      sellOrder: order
    };

    const response = await apiPost(`/u/${user?.account}/market`, null, body);
    if (response.result) {
      const match = response.result.result as BuyOrderMatch[];

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
    }
  };

  const buttons = (
    <div className={styles.buttons}>
      <Button
        onClick={async () => {
          const order: BuyOrder = {
            user: user?.account ?? '',
            budget: 12,
            collectionAddresses: ['apes', 'goop'],
            expiration: expirationTime,
            minNFTs: 2,
            chainId: chainId
          };

          await buy(order);

          listBuyOrders();
        }}
      >
        Buy
      </Button>

      <Button
        onClick={async () => {
          const order: BuyOrder = {
            user: user?.account ?? '',
            budget: 22,
            collectionAddresses: ['apes', 'goop'],
            expiration: expirationTime,
            minNFTs: 4,
            chainId: chainId
          };

          await buy(order);

          listBuyOrders();
        }}
      >
        Buy2
      </Button>

      <Button
        onClick={async () => {
          let order: SellOrder = {
            user: user?.account ?? '',
            collectionAddress: 'goop',
            collectionName: 'goop',
            expiration: expirationTime,
            tokenId: '0xalddsdfsdflsdfkasfsfsjasdlf',
            tokenName: 'Pink Cat',
            price: 1.2,
            chainId: chainId
          };

          await sell(order);

          order = {
            user: user?.account ?? '',
            collectionAddress: 'apes',
            collectionName: 'apes',
            expiration: expirationTime,
            tokenId: '0xalddsdfsdflsdfkasjdlfkjasdlf',
            tokenName: 'Green Cat',
            price: 1.2,
            chainId: chainId
          };

          await sell(order);

          listSellOrders();
        }}
      >
        Sell
      </Button>

      <Button
        onClick={async () => {
          let order: SellOrder = {
            user: user?.account ?? '',
            collectionAddress: 'goop',
            collectionName: 'goop',
            expiration: expirationTime,
            tokenId: '0xaldfsfsflsdfkasjdlfkjasdlf',
            tokenName: 'Blue Cat',
            price: 1.2,
            chainId: chainId
          };

          await sell(order);

          order = {
            user: user?.account ?? '',
            collectionAddress: 'apes',
            collectionName: 'apes',
            expiration: expirationTime,
            tokenId: '0xalddssdsdfkasjdlfkjasdlf',
            tokenName: 'Purple Cat',
            price: 1.2,
            chainId: chainId
          };

          await sell(order);

          listSellOrders();
        }}
      >
        Sell2
      </Button>

      <Button
        onClick={() => {
          listSellOrders();
        }}
      >
        Sell Orders
      </Button>

      <Button
        onClick={() => {
          listBuyOrders();
        }}
      >
        Buy Orders
      </Button>
    </div>
  );

  const handleCardClick = async (order: MarketOrder, action: string) => {
    switch (action) {
      case 'card':
        console.log('clicked card');
        break;
      case 'delete':
        const body: MarketListingsBody = {
          orderType: isBuyOrder(order) ? 'buyOrders' : 'sellOrders',
          action: 'delete',
          listId: 'validActive',
          orderId: order.id,
          moveListId: 'validActive'
        };

        await deleteOrder(body);

        if (isBuyOrder(order)) {
          listBuyOrders();
        } else {
          listSellOrders();
        }
        break;
      default:
        console.log(`not handled: ${action}`);
        break;
    }
  };

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
          <BuyOrderList orders={buyOrders} onClickAction={handleCardClick} />

          <div>Sell Orders</div>
          <SellOrderList orders={sellOrders} onClickAction={handleCardClick} />

          <div>Sell Orders</div>

          <BuyOrderMatchList matches={matchOrders} onBuyClick={handleCardClick} onSellClick={handleCardClick} />
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
MarketPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default MarketPage;
