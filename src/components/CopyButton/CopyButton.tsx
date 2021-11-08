import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import styles from './CopyButton.module.scss';
import { CopyIcon } from '@chakra-ui/icons';
import { useAppContext } from 'utils/context/AppContext';

type Props = {
  copyText?: string;
  tooltip?: string;
};

export const CopyButton = ({ copyText, tooltip = 'Copy to Clipboard' }: Props) => {
  const { showAppMessage } = useAppContext();

  if (!copyText) {
    return <div />;
  }

  return (
    <div className={styles.copyIcon}>
      <Tooltip label={tooltip} placement="top" hasArrow>
        <CopyIcon
          size="sm"
          color="brandBlue"
          aria-label="Copy"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(copyText);
            showAppMessage(`Copied to Clipboard.`);
          }}
        />
      </Tooltip>
    </div>
  );
};
