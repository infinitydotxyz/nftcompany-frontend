import React, { Fragment, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { getTypeAheadOptions, TypeAheadOption } from 'services/Listings.service';
import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { useAppSearchContext } from 'hooks/useSearch';
import { useRouter } from 'next/router';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
const ExploreSearch = () => {
  const { exploreSearchState, setExploreSearchState } = useAppSearchContext();
  const typeaheadRef = useRef<any>();
  const handleSearch = async (query: string) => {
    const results = await getTypeAheadOptions({ startsWith: query });
    setExploreSearchState({
      ...exploreSearchState,
      isLoading: false,
      options: [...results.collectionNames, ...results.nftNames],
      query
    });
  };
  const router = useRouter();
  return (
    <Box display="flex">
      <Box flex="1">
        <AsyncTypeahead
          id="explore-typeahead"
          onChange={(selectedOptions: TypeAheadOption[]) => {
            if (selectedOptions[0]?.type === 'Collection') {
              setExploreSearchState({
                ...exploreSearchState,
                listedNfts: [],
                selectedOption: null,
                collectionName: selectedOptions[0].name
              });
            } else {
              setExploreSearchState({
                ...exploreSearchState,
                listedNfts: [],
                selectedOption: selectedOptions[0],
                collectionName: ''
              });
            }

            if (router.route !== '/explore') {
              router.push('/explore');
            }
          }}
          ref={typeaheadRef}
          minLength={1}
          filterBy={() => true}
          labelKey={(option) => option.name}
          isLoading={exploreSearchState.isLoading}
          onSearch={handleSearch}
          options={exploreSearchState.options}
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
      {(exploreSearchState.collectionName || exploreSearchState.selectedOption) && (
        <CloseIcon
          color="gray.400"
          m="auto"
          mx="3"
          cursor="pointer"
          onClick={() => {
            typeaheadRef.current.clear();
            setExploreSearchState({ ...exploreSearchState, collectionName: '', selectedOption: null });
          }}
        />
      )}
    </Box>
  );
};

export default ExploreSearch;
