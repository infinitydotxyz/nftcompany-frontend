import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import { EthToken, WEthToken } from 'components/Icons/Icons';
import { format } from 'timeago.js';
import { parseTimestampString } from 'utils/commonUtil';
import { Box } from '@chakra-ui/layout';
import styles from './PriceBox.module.scss';

type Props = {
  price?: number;
  token?: '' | 'ETH' | 'WETH';
  expirationTime?: string;
  justifyRight?: boolean;
  noBorder?: boolean;
};

export const PriceBox = ({ justifyRight = false, price, expirationTime = '', token = '', noBorder = false }: Props) => {
  let priceStr = '0';

  if (price) {
    let newPrice: number;

    if (typeof price === 'string') {
      newPrice = parseFloat(price);
    } else {
      newPrice = price;
    }

    if (newPrice > 10000) {
      priceStr = newPrice.toExponential();
    } else {
      priceStr = newPrice.toString();
    }

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
          <div className={styles.price + ' ' + (noBorder === true ? styles.noBorder : '')}>
            <Box pb={1}>{priceStr}</Box> {token === 'ETH' ? <EthToken /> : <WEthToken />}
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
