import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import { EthToken, WEthToken } from 'components/Icons/Icons';
import { format } from 'timeago.js';
import { parseTimestampString } from 'utils/commonUtil';
import { Box } from '@chakra-ui/layout';
import styles from './styles.module.scss';

type Props = {
  price?: number;
  token?: '' | 'ETH' | 'WETH';
  expirationTime?: string;
  justifyRight?: boolean;
};

export const PriceBoxFloater = ({ justifyRight = false, price, expirationTime = '', token = '' }: Props) => {
  let priceStr = '0';

  if (price) {
    let newPrice: number;

    if (typeof price === 'string') {
      console.log('PriceBox: price is a string');

      newPrice = parseFloat(price);
    } else {
      newPrice = price;
    }

    if (newPrice > 10000) {
      priceStr = newPrice.toExponential();
    } else {
      priceStr = newPrice.toString();
    }

    const expDate = parseTimestampString(expirationTime, true);
    return (
      <Tooltip
        label={
          <div>
            <div>{`Token: ${token}`}</div>
            {expDate && (
              <div>
                <div>Ends {format(expDate?.getTime())}</div>
                <div>{`Expires on ${expDate?.toLocaleString()}`}</div>
              </div>
            )}
          </div>
        }
      >
        <div className={styles.priceBox}>
          <div className={styles.price}>
            <Box>{priceStr}</Box> {token === 'ETH' ? <EthToken /> : <WEthToken />}
          </div>
        </div>
      </Tooltip>
    );
  }

  return null;
};
