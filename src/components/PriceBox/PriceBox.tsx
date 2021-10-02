import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import { EthToken, WEthToken } from 'components/Icons/Icons';
import { format } from 'timeago.js';
import styles from './PriceBox.module.scss';
import { parseTimestampString } from 'utils/commonUtil';

type Props = {
  price?: number;
  token?: '' | 'ETH' | 'WETH';
  expirationTime?: string;
  justifyRight?: boolean;
};

export const PriceBox = ({ justifyRight = false, price, expirationTime = '', token = '' }: Props) => {
  if (price) {
    const priceStyle = [styles.priceBox];

    if (justifyRight) {
      priceStyle.push(styles.onRight);
    }

    const expDate = parseTimestampString(expirationTime, true);
    return (
      <Tooltip
        label={
          <div>
            <div>{`Token: ${token}`}</div>
            {expDate && <div>{`Expires on ${expDate?.toLocaleString()}`}</div>}
          </div>
        }
      >
        <div className={priceStyle.join(' ')}>
          <div className={styles.price}>
            {price} {token === 'ETH' ? <EthToken /> : <WEthToken />}
          </div>
          {expDate && (
            <div className={styles.expTime} title={expDate.toLocaleString()}>
              ends {format(expDate?.getTime())}
            </div>
          )}
        </div>
      </Tooltip>
    );
  }

  return null;
};
