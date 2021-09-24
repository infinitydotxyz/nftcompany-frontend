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
};

export const PriceBox = ({ price, expirationTime = '', token = '' }: Props) => {
  if (price) {
    // TODO: remove inline styles
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
        <div>
          <div className={styles.price}>
            {price}{' '}
            {token === 'ETH' ? (
              <EthToken style={{ width: 12, marginTop: -12 }} />
            ) : (
              <WEthToken style={{ width: 12, marginTop: -12 }} />
            )}
          </div>
          {expDate && (
            <div className={styles.expTime} title={expDate.toLocaleString()}>
              end {format(expDate?.getTime())}
            </div>
          )}
        </div>
      </Tooltip>
    );
  }

  return null;
};
