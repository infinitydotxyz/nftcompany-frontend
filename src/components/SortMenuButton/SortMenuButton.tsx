import React from 'react';
import { SearchFilter, useSearchContext } from 'hooks/useSearch';
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';
import { MenuItem } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const SortMenuButton = ({}: any) => {
  const { setFilterState, filterState } = useSearchContext();

  const handleChanges = async (changes: SearchFilter) => {
    const updatedFilter = { ...filterState, ...changes };
    setFilterState(updatedFilter);
  };

  return (
    <HoverMenuButton buttonTitle="Sort by price">
      <MenuItem icon={<StarIcon boxSize={4} />} onClick={() => handleChanges({ ...filterState, sortByPrice: 'DESC' })}>
        Highest price
      </MenuItem>

      <MenuItem icon={<StarIcon boxSize={4} />} onClick={() => handleChanges({ ...filterState, sortByPrice: 'ASC' })}>
        Lowest price
      </MenuItem>
    </HoverMenuButton>
  );
};

SortMenuButton.displayName = 'SortMenuButton';

export default SortMenuButton;
