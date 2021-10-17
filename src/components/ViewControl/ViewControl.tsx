import { IconButton } from '@chakra-ui/button';
import { Tooltip } from '@chakra-ui/react';
import { IconViewIcon, ListViewIcon, ShareIcon } from 'components/Icons/Icons';
import * as React from 'react';
import styles from './ViewControl.module.scss';

type Props = {
  mode: 'list' | 'icon';
  onClick: (mode: 'list' | 'icon') => void;
};

export const ViewControl = ({ onClick, mode }: Props) => {
  return (
    <div className={styles.main}>
      <IconViewButton
        tooltip="List View"
        onClick={() => onClick('list')}
        selected={mode === 'list'}
        icon={<ListViewIcon boxSize="28px" />}
      />
      <div className={styles.divider} />
      <IconViewButton
        tooltip="Icon View"
        onClick={() => onClick('icon')}
        selected={mode === 'icon'}
        icon={<IconViewIcon boxSize="28px" />}
      />
    </div>
  );
};

// ====================================================

type FProps = {
  icon: JSX.Element;
  selected: boolean;
  onClick: () => void;
  tooltip: string;
};

export const IconViewButton = ({ tooltip, onClick, selected, icon }: FProps) => {
  return (
    <div className={styles.shareIcon}>
      <Tooltip label={tooltip} placement="top" hasArrow>
        <IconButton
          size="md"
          variant="ghost"
          color={selected ? 'blue' : 'gray'}
          aria-label="Open link"
          icon={icon}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      </Tooltip>
    </div>
  );
};
