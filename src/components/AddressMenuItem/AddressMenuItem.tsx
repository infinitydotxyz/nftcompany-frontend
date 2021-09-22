import React from 'react';
import styles from './AddressMenuItem.module.scss';
import { Tooltip } from '@chakra-ui/react';

import { MenuItem } from '@chakra-ui/react';
import { ExternalLinkIcon, CopyIcon } from '@chakra-ui/icons';
import { useAppContext, User } from 'utils/context/AppContext';

type Props = {
  user: User;
};

export const AddressMenuItem = ({ user }: Props) => {
  const { showAppMessage } = useAppContext();

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <MenuItem
          icon={<ExternalLinkIcon boxSize={5} />}
          onClick={() => {
            window.open(`https://etherscan.io/address/${user.account}`, '_blank');
          }}
        >
          Go to Etherscan
        </MenuItem>
      </div>

      <div className={styles.right}>
        <Tooltip label="Copy Address">
          <MenuItem
            className={styles.button}
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(user?.account);

              showAppMessage(`Copied to Clipboard.`);
            }}
          >
            <CopyIcon boxSize={5} />
          </MenuItem>
        </Tooltip>
      </div>
    </div>
  );
};
