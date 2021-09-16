import React, { Fragment, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import {
  getListingById,
  getListingsByCollectionName,
  getTypeAheadOptions,
  orderToCardData,
  TypeAheadOption
} from 'services/Listings.service';
interface Props {
  setFilters: any;
  setListedNfts: any;
  setExploreSearchState: any;
  exploreSearchState: ExploreSearchState;
}
export interface ExploreSearchState {
  isLoading: boolean;
  options: TypeAheadOption[];
  query: string;
  collectionName: string;
}
const ExploreSearch = ({ setFilters, setListedNfts, setExploreSearchState, exploreSearchState }: Props) => {
  React.useEffect(() => {
    if (exploreSearchState.collectionName === '') {
      typeaheadRef.current.clear();
    }
  }, [exploreSearchState.collectionName]);
  const typeaheadRef = useRef<any>();
  const handleSearch = async (query: string) => {
    const results = await getTypeAheadOptions({ startsWith: query });
    setExploreSearchState({
      isLoading: false,
      options: [...results.collectionNames, ...results.nftNames],
      query
    });
  };
  const getListing = async (option: TypeAheadOption) => {
    if (option.type === 'Asset' && option.id) {
      const response = await getListingById(option.id, option.address);
      if (response) {
        const cardData = orderToCardData(response);
        setListedNfts([cardData]);
        setExploreSearchState({ ...exploreSearchState, collectionName: '' });
      }
    } else if (option.type === 'Collection') {
      const response = await getListingsByCollectionName(option.name);
      if (response) {
        console.log(response);
        const cardData = response;
        setListedNfts(cardData);
        // typeaheadRef.current.clear();
        setExploreSearchState({ ...exploreSearchState, collectionName: option.name });
      }
    }
  };
  return (
    <AsyncTypeahead
      id="explore-typeahead"
      onChange={(selectedOption: TypeAheadOption[]) => {
        if (selectedOption.length > 0) {
          getListing(selectedOption[0]);
          if (selectedOption[0].type === 'Collection') {
            setExploreSearchState({ ...exploreSearchState, collectionName: selectedOption[0].type });
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
          <strong>{option.type}:</strong>
          <span> {option.name}</span>
        </Fragment>
      )}
    />
  );
};

export default ExploreSearch;
