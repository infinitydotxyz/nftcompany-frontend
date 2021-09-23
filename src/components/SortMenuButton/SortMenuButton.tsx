import React from 'react';
import { SearchFilter, useSearchContext } from 'hooks/useSearch';
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';
import { MenuItem } from '@chakra-ui/react';
import { SortIcon } from 'components/Icons/Icons';

const SortMenuButton = () => {
  const { setFilterState, filterState } = useSearchContext();

  const handleChanges = async (changes: SearchFilter) => {
    const updatedFilter = { ...filterState, ...changes };
    setFilterState(updatedFilter);
  };

  return (
    <HoverMenuButton buttonTitle="Sort by price">
      <MenuItem
        icon={<div style={{ transform: 'scaleX(-1)' }}>{<SortIcon />}</div>}
        onClick={() => handleChanges({ ...filterState, sortByPrice: 'DESC' })}
      >
        Highest price
      </MenuItem>

      <MenuItem
        icon={<div style={{ transform: 'scaleY(-1)' }}>{<SortIcon />}</div>}
        onClick={() => handleChanges({ ...filterState, sortByPrice: 'ASC' })}
      >
        Lowest price
      </MenuItem>
    </HoverMenuButton>
  );
};

SortMenuButton.displayName = 'SortMenuButton';

export default SortMenuButton;
