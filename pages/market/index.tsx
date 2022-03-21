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
  isBuyOrder,
  MarketListIdType
} from '@infinityxyz/lib/types/core';
import { Button, IconButton } from '@chakra-ui/button';
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
import { createOBOrder, OBOrder } from 'utils/exchange/orders';
import { NULL_ADDRESS } from 'utils/constants';
import { ethers } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { infinityExchangeAbi } from 'abi/infinityExchange';
import { Link } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

const MarketPage = (): JSX.Element => {
  const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [matchOrders, setMatchOrders] = useState<BuyOrderMatch[]>([]);
  const { user, chainId, showAppError, showAppMessage, providerManager } = useAppContext();
  const [buyModalShown, setBuyModalShown] = useState(false);
  const [sellModalShown, setSellModalShown] = useState(false);

  const [buyOrdersValidInactive, setBuyOrdersValidInactive] = useState<BuyOrder[]>([]);
  const [buyOrdersInvalid, setBuyOrdersInvalid] = useState<BuyOrder[]>([]);
  const [sellOrdersValidInactive, setSellOrdersValidInactive] = useState<SellOrder[]>([]);
  const [sellOrdersInvalid, setSellOrdersInvalid] = useState<SellOrder[]>([]);

  const [clickedOrder, setClickedOrder] = useState<MarketOrder>();

  useEffect(() => {
    if (user) {
      refreshActiveLists();
    }
  }, [user]);

  // ===========================================================

  // Orderbook orders

  const makeOBOrder = async (order: BuyOrder) => {
    const exchange = '0x26B862f640357268Bd2d9E95bc81553a2Aa81D7E'.toLowerCase();
    const complicationAddress = '0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429';
    const collectionAddresses = ['0x276C216D241856199A83bf27b2286659e5b877D3'];
    const signer = providerManager?.getEthersProvider().getSigner();

    const obOrder: OBOrder = {
      signerAddress: user!.account,
      numItems: order.minNFTs,
      amount: order.budget,
      startTime: Math.floor(Date.now() / 1000),
      endTime: order.expiration,
      isSellOrder: false,
      complicationAddress,
      currencyAddress: NULL_ADDRESS,
      nonce: 1,
      minBpsToSeller: 9000,
      collectionAddresses,
      tokenIds: []
    };
    if (signer) {
      const signedHashedOBOrder = await createOBOrder(chainId, exchange, signer, obOrder);
      const orderHash = signedHashedOBOrder.hash;
      const signedOBOrder = signedHashedOBOrder.signedOrder;

      // split signature
      const splitSig = splitSignature(signedOBOrder.sig);
      const v = splitSig.v;
      const r = splitSig.r;
      const s = splitSig.s;

      console.log('orderHash', orderHash, 'sig: ', splitSig);

      const infinityExchange = new ethers.Contract(exchange, infinityExchangeAbi, signer);
      const isSigValid = await infinityExchange.verifyOrderSig(signedOBOrder);
      console.log('Sig valid:', isSigValid);
    } else {
      console.error('No signer. Are you logged in?');
    }
  };

  // buy orders

  const buy = async (order: BuyOrder) => {
    await makeOBOrder(order);

    const match = await addBuy(order);

    if (match) {
      setMatchOrders(match);

      showAppMessage('Buy successful');
    } else {
      showAppError('Buy submitted');
    }
  };

  const listBuyOrders = async () => {
    await _listBuyOrders('validActive');
  };

  const listBuyOrdersValidInactive = async () => {
    await _listBuyOrders('validInactive');
  };

  const listBuyOrdersInvalid = async () => {
    await _listBuyOrders('invalid');
  };

  const _listBuyOrders = async (listId: MarketListIdType) => {
    const match = await marketBuyOrders(listId);

    if (match) {
      const orders: BuyOrder[] = match as BuyOrder[];

      switch (listId) {
        case 'validActive':
          setBuyOrders(orders);
          break;
        case 'invalid':
          setBuyOrdersInvalid(orders);
          break;
        case 'validInactive':
          setBuyOrdersValidInactive(orders);
          break;
        default:
          console.log('hit default case');
      }
    } else {
      showAppError('An error occured: listBuyOrders');
    }
  };

  // ===========================================================
  // sell orders

  const sell = async (order: SellOrder) => {
    const match = await addSell(order);
    if (match) {
      setMatchOrders(match);
      showAppMessage('sell successful.');
    } else {
      showAppMessage('sell submitted');
    }
  };

  const listSellOrders = async () => {
    await _listSellOrders('validActive');
  };

  const listSellOrdersValidInactive = async () => {
    await _listSellOrders('validInactive');
  };

  const listSellOrdersInvalid = async () => {
    await _listSellOrders('invalid');
  };

  const _listSellOrders = async (listId: MarketListIdType) => {
    const match = await marketSellOrders(listId);

    if (match) {
      const orders: SellOrder[] = match as SellOrder[];

      switch (listId) {
        case 'validActive':
          setSellOrders(orders);
          break;
        case 'invalid':
          setSellOrdersInvalid(orders);
          break;
        case 'validInactive':
          setSellOrdersValidInactive(orders);
          break;
        default:
          console.log('hit default case');
      }
    } else {
      showAppError('An error occured: listBuyOrders');
    }
  };

  // ===========================================================
  // matching orders

  const listMatcheOrders = async () => {
    const matches = await marketMatches();

    setMatchOrders(matches);
  };

  const deleteOrder = async (body: MarketListingsBody) => {
    const response = await marketDeleteOrder(body);

    if (response) {
      showAppMessage(response);
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
        onClick={async () => {
          refreshAllLists();
        }}
      >
        Refresh
      </Button>
    </div>
  );

  const refreshAllLists = async () => {
    refreshActiveLists();
    refreshInactiveLists();
  };

  const refreshActiveLists = async () => {
    listMatcheOrders();
    listBuyOrders();
    listSellOrders();
  };

  const refreshInactiveLists = async () => {
    listBuyOrdersValidInactive();
    listBuyOrdersInvalid();
    listSellOrdersValidInactive();
    listSellOrdersInvalid();
  };

  const handleAcceptClick = async (buyOrder: BuyOrder) => {
    await executeBuyOrder(buyOrder.id ?? '');

    refreshActiveLists();
    refreshInactiveLists();
  };

  const handleCardClick = async (order: MarketOrder, action: string, listId: MarketListIdType) => {
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
          listId: listId,
          orderId: order.id
        };

        await deleteOrder(body);

        if (isBuyOrder(order)) {
          listBuyOrders();
        } else {
          listSellOrders();
        }

        // could be inactive list
        refreshInactiveLists();

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

          {/* === Buy Orders === */}
          <Header title="Buy Orders" onClick={() => listBuyOrders()} />
          {buyOrders.length > 0 && (
            <>
              <BuyOrderList
                orders={buyOrders}
                onClickAction={(order, action) => handleCardClick(order, action, 'validActive')}
              />
            </>
          )}
          {buyOrders.length === 0 && <NothingFound />}

          {/* === Sell Orders === */}
          <Header title="Sell Orders" onClick={() => listSellOrders()} />
          {sellOrders.length > 0 && (
            <>
              <SellOrderList
                orders={sellOrders}
                onClickAction={(order, action) => handleCardClick(order, action, 'validActive')}
              />
            </>
          )}
          {sellOrders.length === 0 && <NothingFound />}

          {/* === Match Orders === */}
          <Header title="Matched Orders" onClick={() => listMatcheOrders()} />
          {matchOrders.length > 0 && (
            <>
              <BuyOrderMatchList
                matches={matchOrders}
                onBuyClick={(order, action) => handleCardClick(order, action, 'validActive')}
                onSellClick={(order, action) => handleCardClick(order, action, 'validActive')}
                onAcceptClick={handleAcceptClick}
              />
            </>
          )}
          {matchOrders.length === 0 && <NothingFound />}

          {/* === Buy Orders (validInactive) === */}
          <Header title="Buy Orders (validInactive)" onClick={() => listBuyOrdersValidInactive()} />
          {buyOrdersValidInactive.length > 0 && (
            <>
              <BuyOrderList
                orders={buyOrdersValidInactive}
                onClickAction={(order, action) => handleCardClick(order, action, 'validInactive')}
              />
            </>
          )}
          {buyOrdersValidInactive.length === 0 && <NothingFound />}

          {/* === Buy Orders (Invalid) === */}
          <Header title="Buy Orders (Invalid)" onClick={() => listBuyOrdersInvalid()} />
          {buyOrdersInvalid.length > 0 && (
            <>
              <BuyOrderList
                orders={buyOrdersInvalid}
                onClickAction={(order, action) => handleCardClick(order, action, 'invalid')}
              />
            </>
          )}
          {buyOrdersInvalid.length === 0 && <NothingFound />}

          {/* === Sell Orders (validInactive) === */}
          <Header title="Sell Orders (validInactive)" onClick={() => listSellOrdersValidInactive()} />
          {sellOrdersValidInactive.length > 0 && (
            <>
              <SellOrderList
                orders={sellOrdersValidInactive}
                onClickAction={(order, action) => handleCardClick(order, action, 'validInactive')}
              />
            </>
          )}
          {sellOrdersValidInactive.length === 0 && <NothingFound />}

          {/* === Sell Orders (Invalid) === */}
          <Header title="Sell Orders (Invalid)" onClick={() => listSellOrdersInvalid()} />
          {sellOrdersInvalid.length > 0 && (
            <>
              <SellOrderList
                orders={sellOrdersInvalid}
                onClickAction={(order, action) => handleCardClick(order, action, 'invalid')}
              />
            </>
          )}
          {sellOrdersInvalid.length === 0 && <NothingFound />}
        </div>

        {buyModalShown && modalComponent(true)}
        {sellModalShown && modalComponent(false)}
      </div>
    </>
  );
};

MarketPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default MarketPage;

// =====================================================

const NothingFound = (): JSX.Element => {
  return (
    <div className={styles.nothingFound}>
      <div className={styles.text}>Nothing Found</div>
    </div>
  );
};

interface Props2 {
  title: string;
  onClick: () => void;
}

const Header = ({ title, onClick }: Props2): JSX.Element => {
  return (
    <div className={styles.header}>
      <div className={styles.text}>{title}</div>

      <IconButton aria-label="" variant="ghost" icon={<RepeatIcon />} isRound onClick={onClick} />
    </div>
  );
};
