import React from 'react';
import { EthToken, WEthToken } from 'components/Icons/Icons';
import { format } from 'timeago.js';
import styles from './PriceBox.module.scss';

type Props = {
  price?: number;
  token?: '' | 'ETH' | 'WETH';
  expirationTime?: string;
};

export const PriceBox = ({ price, expirationTime = '', token = '' }: Props) => {
  if (price) {
    // TODO: remove inline styles
    return (
      <div>
        <div className={styles.price}>
          {price}{' '}
          {token === 'ETH' ? (
            <EthToken style={{ width: 12, marginTop: -12 }} />
          ) : (
            <WEthToken style={{ width: 12, marginTop: -12 }} />
          )}
        </div>
        {expirationTime !== '' && expirationTime !== '0' && <div style={{ color: '#aaa', textAlign: 'center' }}>end {format(parseInt(expirationTime) * 1000)}</div>}
      </div>
    );
  }

  return null;
};
