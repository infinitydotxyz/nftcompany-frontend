import React from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import styles from './ShareButton.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { ShareIcon } from 'components/Icons/Icons';
import { Box, IconButton } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

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
            color="brandBlue"
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

// =====================================
// =====================================

export const ShareIconButton = ({ copyText, tooltip = 'Copy to Clipboard' }: Props) => {
  const { showAppMessage } = useAppContext();

  if (!copyText) {
    return <div />;
  }

  return (
    <div className={styles.shareIcon}>
      <Tooltip label={tooltip} placement="top" hasArrow>
        <IconButton
          size="sm"
          variant="outline"
          colorScheme="gray"
          aria-label="Open link"
          icon={<ShareIcon />}
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

// =====================================
// =====================================

type EProps = {
  url?: string;
  tooltip?: string;
};

export const ExternalLinkButton = ({ url, tooltip = 'Open Link' }: EProps) => {
  const { showAppMessage } = useAppContext();

  if (!url) {
    return <div />;
  }

  return (
    <div className={styles.shareIcon}>
      <Tooltip label={tooltip} placement="top" hasArrow>
        {/* tooltip needs a box around it, this is just an svg image */}
        <Box>
          <ExternalLinkIcon
            size="sm"
            color="brandBlue"
            aria-label="Share"
            onClick={(e: any) => {
              e.stopPropagation();
              window.open(url, '_blank');
            }}
          />
        </Box>
      </Tooltip>
    </div>
  );
};

// =====================================
// =====================================

export const ExternalLinkIconButton = ({ url, tooltip = 'Open Link' }: EProps) => {
  const { showAppMessage } = useAppContext();

  if (!url) {
    return <div />;
  }

  return (
    <div className={styles.shareIcon}>
      <Tooltip label={tooltip} placement="top" hasArrow>
        <IconButton
          size="sm"
          variant="outline"
          colorScheme="gray"
          aria-label="Open link"
          icon={<ExternalLinkIcon />}
          onClick={(e) => {
            e.stopPropagation();

            window.open(url, '_blank');
          }}
        />
      </Tooltip>
    </div>
  );
};
