import React, { Fragment, useRef, KeyboardEvent } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { getTypeAheadOptions, TypeAheadOption } from 'services/Listings.service';
import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { defaultFilterState, useSearchContext } from 'utils/context/SearchContext';
import { useRouter } from 'next/router';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import styles from './ExploreSearch.module.scss';

const ExploreSearch = () => {
  const router = useRouter();
  const { searchState, setSearchState, setFilterState } = useSearchContext();
  const typeaheadRef = useRef<any>();

  const handleSearch = async (query: string) => {
    const results = await getTypeAheadOptions({ startsWith: query });
    setSearchState({
      ...searchState,
      isLoading: false,
      options: [...results.collectionNames, ...results.nftNames],
      query,
      text: query
    });
  };

  // on clicking on a dropdown match:
  const handleChange = (selectedOptions: TypeAheadOption[]) => {
    if (selectedOptions[0]?.type === 'Collection') {
      setSearchState({
        ...searchState,
        selectedOption: undefined,
        collectionName: selectedOptions[0].name
      });
    } else {
      setSearchState({
        ...searchState,
        selectedOption: selectedOptions[0],
        collectionName: ''
      });
    }
    setFilterState(defaultFilterState);
    if (router.route !== '/explore') {
      router.push('/explore');
    }
  };

  const clearSearch = () => {
    typeaheadRef.current.clear();
    setSearchState({ ...searchState, collectionName: '', text: '', selectedOption: undefined });
    setFilterState(defaultFilterState);
  };

  const handleClickCloseIcon = () => {
    clearSearch();
  };

  return (
    <Box display="flex">
      <Box className={styles.typeahead} flex="1">
        <AsyncTypeahead
          id="explore-typeahead"
          onChange={handleChange}
          ref={typeaheadRef}
          minLength={1}
          filterBy={() => true}
          labelKey={(option) => option.name}
          isLoading={searchState.isLoading}
          onSearch={handleSearch}
          options={searchState.options}
          placeholder="Search items..."
          renderMenuItemChildren={(option) => (
            <Fragment>
              <Box d="flex" alignItems="flex-start" textAlign="center">
                <Box my="auto" mx="1" fontSize="lg" fontWeight="medium">
                  <Box d="inline" fontWeight="bold">
                    {option.type}:{' '}
                  </Box>
                  {option.name}
                </Box>
                {option.hasBlueCheck && (
                  <Box m="1" ml="0">
                    <BlueCheckIcon hasBlueCheck={option.hasBlueCheck} />
                  </Box>
                )}
              </Box>
            </Fragment>
          )}
        ></AsyncTypeahead>
      </Box>

      {(searchState.collectionName || searchState.text || searchState.selectedOption) && (
        <CloseIcon color="gray.400" m="auto" mx="3" cursor="pointer" onClick={handleClickCloseIcon} />
      )}
    </Box>
  );
};

export default ExploreSearch;
