import { IconButton } from '@chakra-ui/button';
import { Tooltip } from '@chakra-ui/react';
import { IconViewIcon, ListViewIcon, ShareIcon } from 'components/Icons/Icons';
import * as React from 'react';
import styles from './ViewControl.module.scss';

type Props = {
  mode: 'list' | 'icon';
  onClick: (mode: 'list' | 'icon') => void;
  disabled?: boolean;
};

export const ViewControl = ({ disabled = false, onClick, mode }: Props) => {
  return (
    <div className={styles.main}>
      <IconViewButton
        disabled={disabled}
        tooltip="List View"
        onClick={() => onClick('list')}
        selected={mode === 'list'}
        icon={<ListViewIcon boxSize="28px" />}
      />
      <div className={styles.divider} />
      <IconViewButton
        disabled={disabled}
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
  disabled?: boolean;
};

export const IconViewButton = ({ disabled = false, tooltip, onClick, selected, icon }: FProps) => {
  return (
    <div>
      <Tooltip label={tooltip} placement="top" hasArrow>
        <IconButton
          disabled={disabled}
          size="md"
          variant="ghost"
          color={selected ? '#222' : 'lightgray'}
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
