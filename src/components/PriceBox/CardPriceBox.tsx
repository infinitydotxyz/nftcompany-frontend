import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import { EthToken, WEthToken } from 'components/Icons/Icons';
import { format } from 'timeago.js';
import { parseTimestampString } from 'utils/commonUtil';
import { Box } from '@chakra-ui/layout';
import styles from './CardPriceBox.module.scss';

type Props = {
  label: string;
  price?: number;
  token?: '' | 'ETH' | 'WETH';
  expirationTime?: string;
  onClick?: () => void;
};

export const CardPriceBox = ({ label, price, expirationTime = '', token = '', onClick }: Props) => {
  let priceStr = '0';

  let newPrice: number;

  if (typeof price === 'string') {
    newPrice = parseFloat(price);
  } else {
    newPrice = price || 0;
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
      <div className={styles.priceBox} onClick={onClick}>
        <div className={styles.price}>
          <Box>{label}</Box>
          {priceStr !== '0' ? (
            <>
              <Box ml={3} fontWeight="normal">
                {priceStr}
              </Box>{' '}
              {token === 'ETH' ? <EthToken /> : <WEthToken />}
            </>
          ) : null}
        </div>
      </div>
    </Tooltip>
  );
};
