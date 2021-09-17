import React from 'react';
import styles from './AddressMenuItem.module.scss';
import { Tooltip } from '@chakra-ui/react';

import { MenuItem, useToast } from '@chakra-ui/react';
import { ExternalLinkIcon, CopyIcon } from '@chakra-ui/icons';
import { showMessage } from 'utils/commonUtil';
import { User } from 'utils/context/AppContext';

type Props = {
  user: User;
};

export const AddressMenuItem = ({ user }: Props) => {
  const toast = useToast();

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <MenuItem
          icon={<ExternalLinkIcon />}
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

              showMessage(toast, 'info', `Copied to Clipboard.`);
            }}
          >
            <CopyIcon />
          </MenuItem>
        </Tooltip>
      </div>
    </div>
  );
};
