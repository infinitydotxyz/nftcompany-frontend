import React from 'react';
import Link from 'next/link';
import { Tooltip } from '@chakra-ui/tooltip';
import { CopyButton } from 'components/CopyButton/CopyButton';
import { Spacer, useColorMode } from '@chakra-ui/react';
import { addressesEqual, ellipsisAddress, ellipsisString } from 'utils/commonUtil';
import { useAppContext } from 'utils/context/AppContext';
import clsx from 'classnames';

type Props = {
  className?: string;
  address?: string;
  label: string;
  tooltip?: string;
  href: string;
  newTab?: boolean;
  vertical?: boolean;
};

export const ShortAddress = ({
  className = '',
  vertical,
  href,
  newTab = true,
  address,
  label,
  tooltip = ''
}: Props) => {
  const { user } = useAppContext();
  const { colorMode } = useColorMode();

  const dark = colorMode === 'dark';

  if (!address) {
    return <div />;
  }

  let shortAddress = address;
  if (shortAddress) {
    if (addressesEqual(address, user?.account)) {
      shortAddress = 'You';
    } else {
      // only some addresses are valid for ellipsisAddress even if 0x
      if (shortAddress.startsWith('0x')) {
        shortAddress = ellipsisAddress(address);
      } else {
        shortAddress = ellipsisString(address);
      }
    }
  }

  const link = (
    <div className="flex items-center">
      <Tooltip label={tooltip} hasArrow openDelay={1000}>
        <Link href={href}>
          <a
            href={href}
            target={newTab ? '_blank' : ''}
            rel="noreferrer"
            className="font-heading underline underline-offset-2"
            onClick={(e) => {
              // without this the parent will get the click (if clickable)
              e.stopPropagation();
            }}
          >
            {shortAddress}
          </a>
        </Link>
      </Tooltip>
      <Spacer width={[2, 5]} />
      <CopyButton copyText={address} />
    </div>
  );

  if (label) {
    return (
      <div className={clsx('flex items-center pb-2', className)}>
        <label className="mr-4 font-body tracking-wide">{label}</label>
        {link}
      </div>
    );
  } else {
    return <div>{link}</div>;
  }
};
