import React, { useState, useEffect } from 'react';
import { useSearchContext } from 'utils/context/SearchContext';
import { Box } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { DEFAULT_MIN_PRICE } from './FilterDrawer';
import styles from './FilterPills.module.scss';
import { ListTypeFilterName } from 'utils/constants';

// TODO:
// - show in all pages

export default function FilterPills() {
  const { filterState, setFilterState } = useSearchContext();

  const hasPriceMin = filterState.priceMin && filterState.priceMin !== DEFAULT_MIN_PRICE.toString();
  const hasFilter = filterState.listType || hasPriceMin || filterState.priceMax;

  const traitTypes = (filterState?.traitType || '').split(',');
  const traitValues = (filterState?.traitValue || '').split(',');

  return (
    <Box display="flex" mt={4} alignItems="center">
      {filterState.listType && (
        <Box className={styles.pill}>
          <div>{ListTypeFilterName[filterState.listType]}</div>
          <SmallCloseIcon
            onClick={() => {
              const newFilter = { ...filterState };
              newFilter.listType = '';
              setFilterState(newFilter);
            }}
          />
        </Box>
      )}

      {hasPriceMin && (
        <Box className={styles.pill}>
          <div>&gt; {filterState.priceMin} ETH</div>
          <SmallCloseIcon
            onClick={() => {
              const newFilter = { ...filterState };
              newFilter.priceMin = '';
              filterState.listType = '';
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

      {traitTypes.map((traitType, idx) => {
        const values = traitValues[idx].split('|'); // example: 'blue|red'
        return (
          <>
            {values.map((value) => {
              if (!value) {
                return null;
              }
              return (
                <Box key={`${traitType}_${value}`} className={styles.pill}>
                  <div>{value}</div>
                  <SmallCloseIcon
                    onClick={() => {
                      const newFilter = { ...filterState };
                      traitValues[idx] = values.filter((str: string) => str !== value).join('|');
                      if (traitValues[idx] === '') {
                        traitTypes[idx] = '';
                      }
                      newFilter.traitValue = traitValues.join(',');
                      setFilterState(newFilter);
                    }}
                  />
                </Box>
              );
            })}
          </>
        );
      })}

      {hasFilter && (
        <Box
          onClick={() => {
            const newFilter = { ...filterState };
            newFilter.priceMin = '';
            newFilter.priceMax = '';
            newFilter.listType = '';
            newFilter.traitType = '';
            newFilter.traitValue = '';
            setFilterState(newFilter);
          }}
          cursor="pointer"
          mb={1}
        >
          Clear All
        </Box>
      )}
    </Box>
  );
}
