import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { PageHeader } from 'components/PageHeader';
import {
  BuyOrder,
  BuyOrderMatch,
  MarketListingsBody,
  MarketOrder,
  SellOrder,
  isBuyOrder
} from '@infinityxyz/lib/types/core';
import { Button } from '@chakra-ui/button';
import { BuyOrderList, BuyOrderMatchList, SellOrderList } from './MarketList';
import MarketOrderModal from 'components/MarketOrderModal';
import {
  marketBuy,
  marketMatches,
  marketBuyOrders,
  marketDeleteOrder,
  marketSell,
  marketSellOrders
} from './marketUtils';

const MarketPage = (): JSX.Element => {
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [matchOrders, setMatchOrders] = useState<BuyOrderMatch[]>([]);
  const { user, chainId, showAppError, showAppMessage } = useAppContext();
  const [buyModalShown, setBuyModalShown] = useState(false);
  const [sellModalShown, setSellModalShown] = useState(false);

  const [clickedOrder, setClickedOrder] = useState<MarketOrder>();

  const buy = async (order: BuyOrder) => {
    const match = await marketBuy(order);

    if (match) {
      setMatchOrders(match);

      showAppMessage('Buy successful');
    } else {
      showAppError('Buy submitted');
    }
  };

  const listBuyOrders = async () => {
    const match = await marketBuyOrders();

    if (match) {
      const orders: BuyOrder[] = match as BuyOrder[];

      setBuyOrders(orders);
    } else {
      showAppError('An error occured: listBuyOrders');
    }
  };

  const listMatches = async () => {
    const matches = await marketMatches();
    setMatchOrders(matches);
  };

  const listSellOrders = async () => {
    const match = await marketSellOrders();

    if (match) {
      const orders: SellOrder[] = match as SellOrder[];

      setSellOrders(orders);
    } else {
      showAppError('Sell Submitted');
    }
  };

  const deleteOrder = async (body: MarketListingsBody) => {
    const response = await marketDeleteOrder(body);

    if (response) {
      showAppMessage(response);
    }
  };

  const sell = async (order: SellOrder) => {
    const match = await marketSell(order);
    if (match) {
      setMatchOrders(match);
      showAppMessage('sell successful.');
    } else {
      showAppMessage('sell submitted');
    }
  };

  const buttons = (
    <div className={styles.buttons}>
      <Button
        onClick={async () => {
          setBuyModalShown(true);
        }}
      >
        Buy
      </Button>

      <Button
        onClick={async () => {
          setSellModalShown(true);
        }}
      >
        Sell
      </Button>

      <Button
        onClick={() => {
          listSellOrders();
          listBuyOrders();
        }}
      >
        Orders
      </Button>

      <Button
        onClick={async () => {
          listMatches();
        }}
      >
        Matches
      </Button>
    </div>
  );

  const handleCardClick = async (order: MarketOrder, action: string) => {
    switch (action) {
      case 'card':
        setClickedOrder(order);

        if (isBuyOrder(order)) {
          setBuyModalShown(true);
        } else {
          setSellModalShown(true);
        }
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

        // clear this
        setMatchOrders([]);
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

          {buyOrders.length > 0 && (
            <>
              <div className={styles.header}>Buy Orders</div>
              <BuyOrderList orders={buyOrders} onClickAction={handleCardClick} />
            </>
          )}

          {sellOrders.length > 0 && (
            <>
              <div className={styles.header}>Sell Orders</div>
              <SellOrderList orders={sellOrders} onClickAction={handleCardClick} />
            </>
          )}

          {matchOrders.length > 0 && (
            <>
              <div className={styles.header}>Match Orders</div>
              <BuyOrderMatchList matches={matchOrders} onBuyClick={handleCardClick} onSellClick={handleCardClick} />
            </>
          )}
        </div>

        {buyModalShown && (
          <MarketOrderModal
            inOrder={clickedOrder}
            buyMode={true}
            onClose={async (buyOrder, sellOrder) => {
              setBuyModalShown(false);

              if (buyOrder) {
                await buy(buyOrder);

                listBuyOrders();
              }
            }}
          />
        )}

        {sellModalShown && (
          <MarketOrderModal
            inOrder={clickedOrder}
            buyMode={false}
            onClose={async (buyOrder, sellOrder) => {
              setSellModalShown(false);

              if (sellOrder) {
                await sell(sellOrder);

                listSellOrders();
              }
            }}
          />
        )}
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
MarketPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default MarketPage;
