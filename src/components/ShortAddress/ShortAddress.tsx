import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import styles from './ShortAddress.module.scss';
import { CopyButton } from 'components/CopyButton/CopyButton';
import { Link, Spacer } from '@chakra-ui/react';
import { Label } from 'components/Text/Text';
import { addressesEqual, ellipsisAddress, ellipsisString } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';

type Props = {
  address?: string;
  label: string;
  tooltip?: string;
  href: string;
  newTab?: boolean;
  vertical?: boolean;
};

export const ShortAddress = ({ vertical, href, newTab = true, address, label, tooltip = '' }: Props) => {
  const { user } = useAppContext();

  if (!address) {
    return <div />;
  }

  let shortAddress = address;
  if (shortAddress) {
    if (addressesEqual(address, user?.account)) {
      shortAddress = 'You';
    } else {
      if (shortAddress.startsWith('0x')) {
        shortAddress = ellipsisAddress(address);
      } else {
        shortAddress = ellipsisString(address);
      }
    }
  }

  return (
    <div className={vertical ? styles.mainVertical : styles.main}>
      <Label bold text={label} />

      <Spacer />

      <div className={styles.link}>
        <Tooltip label={tooltip} hasArrow openDelay={1000}>
          <Link color="brandBlue" href={href} target={newTab ? '_blank' : ''} rel="noreferrer">
            {shortAddress}
          </Link>
        </Tooltip>
        <CopyButton copyText={address} />
      </div>
    </div>
  );
};
