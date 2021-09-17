import React, { Fragment, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import {
  getListingById,
  getListingsByCollectionName,
  getTypeAheadOptions,
  orderToCardData,
  TypeAheadOption
} from 'services/Listings.service';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { ExploreSearchState } from 'hooks/useSearch';
import { useRouter } from 'next/router';
interface Props {
  setFilters: any;
  setExploreSearchState: any;
  exploreSearchState: ExploreSearchState;
}
const ExploreSearch = ({ setExploreSearchState, exploreSearchState }: Props) => {
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
  const getListing = async (option: TypeAheadOption) => {
    if (option.type === 'Asset' && option.id) {
      const response = await getListingById(option.id, option.address);
      if (response) {
        const cardData = orderToCardData(response);
        setExploreSearchState({ ...exploreSearchState, collectionName: '', listedNfts: [cardData] });
      }
    } else if (option.type === 'Collection') {
      const response = await getListingsByCollectionName(option.name);
      if (response) {
        const cardData = response;
        setExploreSearchState({ ...exploreSearchState, collectionName: option.name, listedNfts: [cardData] });
      }
    }
  };
  return (
    <Box display="flex">
      <Box flex="1">
        <AsyncTypeahead
          id="explore-typeahead"
          onChange={(selectedOption: TypeAheadOption[]) => {
            if (selectedOption.length > 0) {
              getListing(selectedOption[0]);
              if (selectedOption[0].type === 'Collection') {
                setExploreSearchState({ ...exploreSearchState, collectionName: selectedOption[0].name });
              }

              if (router.route !== '/explore') {
                router.push('/explore');
              }
            }
          }}
          ref={typeaheadRef}
          minLength={1}
          filterBy={() => true}
          labelKey={(option) => option.name}
          isLoading={exploreSearchState.isLoading}
          onSearch={handleSearch}
          options={exploreSearchState.options}
          placeholder="Search For Any Nft"
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
                    <CheckCircleIcon color="blue.500" w="4" h="4" />
                  </Box>
                )}
              </Box>
            </Fragment>
          )}
        ></AsyncTypeahead>
      </Box>
      {exploreSearchState.collectionName && (
        <CloseIcon
          color="gray.400"
          m="auto"
          mx="3"
          cursor="pointer"
          onClick={() => {
            typeaheadRef.current.clear();
            setExploreSearchState({ ...exploreSearchState, collectionName: '' });
          }}
        />
      )}
    </Box>
  );
};

export default ExploreSearch;
