import React, { useState, useEffect } from 'react';
import { useSearchContext } from 'utils/context/SearchContext';
import { Box } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { DEFAULT_MIN_PRICE } from './FilterDrawer';
import styles from './FilterPills.module.scss';

// TODO:
// - show in all pages
// - Clear All link

export default function FilterPills() {
  const { filterState, setFilterState } = useSearchContext();

  useEffect(() => {}, [filterState]);

  return (
    <Box display="flex" mt={4}>
      {filterState.priceMin && filterState.priceMin !== DEFAULT_MIN_PRICE.toString() && (
        <Box className={styles.pill}>
          <div>&gt; {filterState.priceMin} ETH</div>
          <SmallCloseIcon
            onClick={() => {
              const newFilter = { ...filterState };
              newFilter.priceMin = '';
              setFilterState(newFilter);
            }}
          />
        </Box>
      )}

      {filterState.priceMax && (
        <Box className={styles.pill}>
          <div>&lt; {filterState.priceMax} ETH</div>
          <SmallCloseIcon
            onClick={() => {
              const newFilter = { ...filterState };
              newFilter.priceMax = '';
              setFilterState(newFilter);
            }}
          />
        </Box>
      )}
    </Box>
  );
}
