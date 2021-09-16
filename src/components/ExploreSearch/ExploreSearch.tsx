import React, { Fragment, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import {
  getListingById,
  getListingsByCollectionName,
  getTypeAheadOptions,
  orderToCardData,
  TypeAheadOption
} from 'services/Listings.service';
import { Order } from 'types/Nft.interface';
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
}
const ExploreSearch = ({ setFilters, setListedNfts, setExploreSearchState, exploreSearchState }: Props) => {
  const typeaheadRef = useRef<any>();
  const handleSearch = async (query: string) => {
    const results = await getTypeAheadOptions({ startsWith: query });
    // console.log(results);
    // const response: Order[] = (await getListingsByTitle({ startsWith: query })) as any;
    setExploreSearchState({
      isLoading: false,
      options: [...results.collectionNames, ...results.nftNames],
      query
    });
  };
  const getListing = async (option: TypeAheadOption) => {
    if (option.type === 'Asset' && option.id) {
      const response = await getListingById(option.id);
      if (response) {
        const cardData = orderToCardData(response);
        console.log(cardData);
        setListedNfts([cardData]);
      }
    } else if (option.type === 'Collection') {
      const response = await getListingsByCollectionName(option.name);
      if (response) {
        const cardData = response.map(orderToCardData);
        setListedNfts(cardData);
      }
    }
  };
  return (
    <AsyncTypeahead
      id="explore-typeahead"
      onChange={(selectedOption: TypeAheadOption[]) => {
        if (selectedOption.length > 0) {
          getListing(selectedOption[0]);
          // typeaheadRef.current.clear();
        }
      }}
      ref={typeaheadRef}
      minLength={1}
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
