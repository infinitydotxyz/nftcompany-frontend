import React from 'react';
import styles from './AddressMenuItem.module.scss';
import { Tooltip, MenuItem } from '@chakra-ui/react';
import { useAppContext, User } from 'utils/context/AppContext';
import { MenuIcons } from 'components/Icons/MenuIcons';
import { CHAIN_SCANNER_BASE } from 'utils/constants';

type Props = {
  user: User;
};

export const AddressMenuItem = ({ user }: Props) => {
  const { showAppMessage } = useAppContext();

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <MenuItem
          icon={MenuIcons.externalLinkIcon}
          onClick={() => {
            window.open(`${CHAIN_SCANNER_BASE}/address/${user.account}`, '_blank');
          }}
        >
          Go to link
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
            {MenuIcons.copyIcon}
          </MenuItem>
        </Tooltip>
      </div>
    </div>
  );
};
