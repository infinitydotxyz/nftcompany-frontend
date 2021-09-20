import React from 'react';
import styles from './PriceBox.module.scss';

type Props = {
  price?: number;
};

export const PriceBox = ({ price }: Props) => {
  if (price) {
    return <div className={styles.price}>{price} ETH</div>;
  }

  return null;
};
