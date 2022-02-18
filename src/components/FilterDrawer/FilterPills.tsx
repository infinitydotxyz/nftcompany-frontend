import React, { useState, useEffect } from 'react';
import { useSearchContext } from 'utils/context/SearchContext';
import { Box } from '@chakra-ui/react';
import { DEFAULT_MIN_PRICE } from './FilterDrawer';

export default function FilterPills() {
  const { filterState, setFilterState } = useSearchContext();

  useEffect(() => {}, [filterState]);

  return (
    <Box
      display="flex"
      onClick={() => {
        const newFilter = { ...filterState };
        newFilter.priceMin = '';
        newFilter.priceMax = '';
        setFilterState(newFilter);
      }}
    >
      {filterState.priceMin && filterState.priceMin !== DEFAULT_MIN_PRICE.toString() && (
        <Box p={2} mr={2} mt={4} border="1px solid #eee">
          &gt; {filterState.priceMin} ETH
        </Box>
      )}
      {filterState.priceMax && (
        <Box p={2} mr={2} mt={4} border="1px solid #eee">
          &lt; {filterState.priceMax} ETH
        </Box>
      )}
    </Box>
  );
}
