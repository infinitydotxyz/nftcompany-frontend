import React, { useEffect, useState } from 'react';
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
import { BuyOrderList, BuyOrderMatchList, SellOrderList } from 'components/MarketList';
import MarketOrderModal from 'components/MarketOrderModal';
import {
  addBuy,
  marketMatches,
  marketBuyOrders,
  marketDeleteOrder,
  addSell,
  marketSellOrders,
  executeBuyOrder
} from 'utils/marketUtils';

const MarketPage = (): JSX.Element => {
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [matchOrders, setMatchOrders] = useState<BuyOrderMatch[]>([]);
  const { user, chainId, showAppError, showAppMessage } = useAppContext();
  const [buyModalShown, setBuyModalShown] = useState(false);
  const [sellModalShown, setSellModalShown] = useState(false);

  const [clickedOrder, setClickedOrder] = useState<MarketOrder>();

  useEffect(() => {
    if (user) {
      refreshAllLists();
    }
  }, [user]);

  const buy = async (order: BuyOrder) => {
    const match = await addBuy(order);

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
    const match = await addSell(order);
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
          setClickedOrder(undefined);

          setBuyModalShown(true);
        }}
      >
        Buy
      </Button>

      <Button
        onClick={async () => {
          setClickedOrder(undefined);

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

  const refreshAllLists = async () => {
    listMatches();
    listBuyOrders();
    listSellOrders();
  };

  const handleAcceptClick = async (buyOrder: BuyOrder) => {
    await executeBuyOrder(buyOrder.id ?? '');

    refreshAllLists();
  };

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

  const modalComponent = (buyMode: boolean) => {
    return (
      <MarketOrderModal
        inOrder={clickedOrder}
        buyMode={buyMode}
        onClose={async (buyOrder, sellOrder) => {
          if (buyMode) {
            setBuyModalShown(false);

            if (buyOrder) {
              await buy(buyOrder);

              listBuyOrders();
            }
          } else {
            setSellModalShown(false);

            if (sellOrder) {
              await sell(sellOrder);

              listSellOrders();
            }
          }
        }}
      />
    );
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
              <BuyOrderMatchList
                matches={matchOrders}
                onBuyClick={handleCardClick}
                onSellClick={handleCardClick}
                onAcceptClick={handleAcceptClick}
              />
            </>
          )}
        </div>

        {buyModalShown && modalComponent(true)}
        {sellModalShown && modalComponent(false)}
      </div>
    </>
  );
};

MarketPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default MarketPage;
