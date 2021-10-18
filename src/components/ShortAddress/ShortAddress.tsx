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
  isEthAddress?: boolean;
};

export const ShortAddress = ({
  isEthAddress = true,
  vertical,
  href,
  newTab = true,
  address,
  label,
  tooltip = ''
}: Props) => {
  const { user } = useAppContext();

  if (!address) {
    return <div />;
  }

  let shortAddress = address;
  if (shortAddress) {
    if (addressesEqual(address, user?.account)) {
      shortAddress = 'You';
    } else {
      // only some addresses are valid for ellipsisAddress even if 0x
      if (isEthAddress && shortAddress.startsWith('0x')) {
        shortAddress = ellipsisAddress(address);
      } else {
        shortAddress = ellipsisString(address);
      }
    }
  }

  const link = (
    <div className={styles.link}>
      <Tooltip label={tooltip} hasArrow openDelay={1000}>
        <Link
          color="brandBlue"
          href={href}
          target={newTab ? '_blank' : ''}
          rel="noreferrer"
          onClick={(e) => {
            // without this the parent will get the click (if clickable)
            e.stopPropagation();
          }}
        >
          {shortAddress}
        </Link>
      </Tooltip>
      <CopyButton copyText={address} />
    </div>
  );

  if (label) {
    return (
      <div className={vertical ? styles.mainVertical : styles.main}>
        <Label bold={vertical} text={label} />

        <Spacer />

        {link}
      </div>
    );
  } else {
    return <div>{link}</div>;
  }
};
