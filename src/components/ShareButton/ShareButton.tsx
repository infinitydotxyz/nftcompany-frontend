import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import styles from './ShareButton.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { ShareIcon } from 'components/Icons/Icons';
import { Box } from '@chakra-ui/react';

type Props = {
  copyText?: string;
  tooltip?: string;
};

export const ShareButton = ({ copyText, tooltip = 'Copy to Clipboard' }: Props) => {
  const { showAppMessage } = useAppContext();

  if (!copyText) {
    return <div />;
  }

  return (
    <div className={styles.shareIcon}>
      <Tooltip label={tooltip} placement="top" hasArrow>
        {/* tooltip needs a box around it, this is just an svg image */}
        <Box>
          <ShareIcon
            size="sm"
            color="blue"
            aria-label="Share"
            onClick={(e: any) => {
              e.stopPropagation();
              navigator.clipboard.writeText(copyText);
              showAppMessage(`Copied to Clipboard.`);
            }}
          />
        </Box>
      </Tooltip>
    </div>
  );
};
