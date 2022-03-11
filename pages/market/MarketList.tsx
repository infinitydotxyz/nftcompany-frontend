import React from 'react';
import { BuyOrder, BuyOrderMatch, SellOrder } from '@infinityxyz/lib/types/core';
import { uuidv4 } from 'utils/commonUtil';
import styles from './styles.module.scss';
import { Button } from '@chakra-ui/button';

// =======================================================

type Props = {
  orders: BuyOrder[];
  onClickAction: (order: BuyOrder) => void;
};

export const BuyOrderList = ({ orders, onClickAction }: Props): JSX.Element => {
  return (
    <div className={styles.cardList}>
      {(orders || []).map((order) => {
        if (!order) {
          return null;
        }

        return <BuyOrderCard key={uuidv4()} order={order} onClickAction={onClickAction} />;
      })}
    </div>
  );
};

// =======================================================

type Props2 = {
  order: BuyOrder;
  onClickAction: (order: BuyOrder) => void;
};

const BuyOrderCard = ({ order, onClickAction }: Props2): JSX.Element => {
  return (
    <div className={styles.card} onClick={() => onClickAction(order)}>
      <div className={styles.title}>Buy Order</div>
      <div>budget: {order.budget}</div>
      <div>collectionAddresses: {order.collectionAddresses}</div>
      <div>minNFTs: {order.minNFTs}</div>
      <div>chainId: {order.chainId}</div>
      <div>expiration: {order.expiration}</div>
      <div>user: {order.user}</div>

      <div className={styles.buttons}>
        <Button variant="ghost" onClick={() => console.log('delete')}>
          Delete
        </Button>
      </div>
    </div>
  );
};

// =======================================================

type Props10 = {
  orders: SellOrder[];
  onClickAction: (order: SellOrder) => void;
};

export const SellOrderList = ({ orders, onClickAction }: Props10): JSX.Element => {
  return (
    <div className={styles.cardList}>
      {(orders || []).map((order) => {
        if (!order) {
          return null;
        }

        return <SellOrderCard key={uuidv4()} order={order} onClickAction={onClickAction} />;
      })}
    </div>
  );
};

// =======================================================

type Props11 = {
  order: SellOrder;
  onClickAction: (order: SellOrder) => void;
};

const SellOrderCard = ({ order, onClickAction }: Props11): JSX.Element => {
  return (
    <div className={styles.card} onClick={() => onClickAction(order)}>
      <div className={styles.title}>Sell Order</div>
      <div>price: {order.price}</div>
      <div>tokenName: {order.tokenName}</div>
      <div>tokenId: {order.tokenId}</div>
      <div>collectionAddress: {order.collectionAddress}</div>
      <div>collectionName: {order.collectionName}</div>
      <div>chainId: {order.chainId}</div>
      <div>expiration: {order.expiration}</div>
      <div>user: {order.user}</div>
      <div className={styles.buttons}>
        <Button variant="ghost" onClick={() => console.log('delete')}>
          Delete
        </Button>
      </div>
    </div>
  );
};

// =======================================================

type Props20 = {
  matches: BuyOrderMatch[];
  onSellClick: (order: SellOrder) => void;
  onBuyClick: (order: BuyOrder) => void;
};

export const BuyOrderMatchList = ({ matches, onBuyClick, onSellClick }: Props20): JSX.Element => {
  if (matches.length === 0) {
    return <></>;
  }

  return (
    <>
      {matches.map((match) => {
        return (
          <div key={uuidv4()} className={styles.cardList}>
            <BuyOrderMatchCard key={uuidv4()} match={match} onBuyClick={onBuyClick} onSellClick={onSellClick} />
          </div>
        );
      })}
    </>
  );
};

// =======================================================

type Props21 = {
  match: BuyOrderMatch;
  onSellClick: (order: SellOrder) => void;
  onBuyClick: (order: BuyOrder) => void;
};

const BuyOrderMatchCard = ({ match, onSellClick, onBuyClick }: Props21): JSX.Element => {
  let buyCard;
  if (match.buyOrder) {
    buyCard = <BuyOrderCard order={match.buyOrder} onClickAction={onBuyClick} />;
  }

  return (
    <>
      <div>Buy Order</div>
      {buyCard}

      <div>Sell Orders</div>

      {match.sellOrders && match.sellOrders.length > 0 && (
        <SellOrderList orders={match.sellOrders} onClickAction={onSellClick} />
      )}
    </>
  );
};
