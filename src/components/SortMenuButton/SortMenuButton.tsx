import React, { useState } from 'react';
import { SearchFilter, useSearchContext } from 'utils/context/SearchContext';
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';
import { MenuDivider, MenuItem } from '@chakra-ui/react';
import { SortIcon } from 'components/Icons/Icons';
import { CloseIcon } from '@chakra-ui/icons';

const SortMenuButton = () => {
  const { setFilterState, filterState } = useSearchContext();
  const [buttonTitle, setButtonTitle] = useState('Sort by price');

  const handleChanges = async (changes: SearchFilter) => {
    const updatedFilter = { ...filterState, ...changes };
    setFilterState(updatedFilter);
  };

  return (
    <HoverMenuButton buttonTitle={buttonTitle}>
      <MenuItem
        icon={<div style={{ transform: 'scaleX(-1)' }}>{<SortIcon />}</div>}
        onClick={() => {
          setButtonTitle('Highest price');
          handleChanges({ ...filterState, sortByPrice: 'DESC' });
        }}
      >
        Highest price
      </MenuItem>

      <MenuItem
        icon={<div style={{ transform: 'scaleY(-1)' }}>{<SortIcon />}</div>}
        onClick={() => {
          setButtonTitle('Lowest price');

          handleChanges({ ...filterState, sortByPrice: 'ASC' });
        }}
      >
        Lowest price
      </MenuItem>

      <MenuDivider />

      <MenuItem
        icon={<CloseIcon />}
        onClick={() => {
          setButtonTitle('Sort by price');

          return handleChanges({ ...filterState, sortByPrice: '' });
        }}
      >
        Clear
      </MenuItem>
    </HoverMenuButton>
  );
};

SortMenuButton.displayName = 'SortMenuButton';

export default SortMenuButton;
