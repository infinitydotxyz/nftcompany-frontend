import React, { useState } from 'react';
import { SearchFilter } from 'utils/context/SearchContext';
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';
import { MenuDivider, MenuItem } from '@chakra-ui/react';
import { MenuIcons } from 'components/Icons/MenuIcons';

interface Props {
  disabled?: boolean;
  setFilterState: (filterState: SearchFilter) => void;
  filterState: SearchFilter | null;
  showBorder?: boolean;
}

const SortMenuButton = ({ disabled = false, setFilterState, filterState, showBorder }: Props) => {
  const [buttonTitle, setButtonTitle] = useState('Sort by price');

  const handleChanges = async (changes: SearchFilter) => {
    const updatedFilter = { ...filterState, ...changes };
    setFilterState(updatedFilter);
  };

  return (
    <HoverMenuButton buttonTitle={buttonTitle} disabled={disabled} showBorder={showBorder}>
      <MenuItem
        icon={<div style={{ transform: 'scaleX(-1)' }}>{MenuIcons.sortIcon}</div>}
        onClick={() => {
          setButtonTitle('Highest price');
          handleChanges({ ...(filterState || ({} as any)), sortByPrice: 'DESC' });
        }}
      >
        Highest price
      </MenuItem>

      <MenuItem
        icon={<div style={{ transform: 'scaleY(-1)' }}>{MenuIcons.sortIcon}</div>}
        onClick={() => {
          setButtonTitle('Lowest price');
          handleChanges({ ...(filterState || ({} as any)), sortByPrice: 'ASC' });
        }}
      >
        Lowest price
      </MenuItem>

      <MenuDivider />

      <MenuItem
        icon={MenuIcons.closeIcon}
        onClick={() => {
          setButtonTitle('Sort by price');
          return handleChanges({ ...(filterState || ({} as any)), sortByPrice: '' });
        }}
      >
        Clear
      </MenuItem>
    </HoverMenuButton>
  );
};

SortMenuButton.displayName = 'SortMenuButton';

export default SortMenuButton;
