import React, { Fragment, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { getListingsByTitle, orderToCardData } from 'services/Listings.service';
import { Order } from 'types/Nft.interface';

interface Props {
  setFilters: any;
  setListedNfts: any;
  setExploreSearchState: any;
  exploreSearchState: ExploreSearchState;
}
export interface ExploreSearchState {
  isLoading: boolean;
  options: Order[];
  query: string;
}
const ExploreSearch = ({ setFilters, setListedNfts, setExploreSearchState, exploreSearchState }: Props) => {
  const typeaheadRef = useRef<any>();
  const handleSearch = async (query: string) => {
    const response: Order[] = (await getListingsByTitle({ startsWith: query })) as any;
    setExploreSearchState({
      isLoading: false,
      options: response,
      query
    });
  };
  return (
    <AsyncTypeahead
      id="explore-typeahead"
      onChange={(selectedOrders: Order[]) => {
        if (selectedOrders.length > 0) {
          setFilters({ price: 10000, sortByPrice: undefined, sortByLikes: undefined });
          setListedNfts(selectedOrders.map(orderToCardData));
          typeaheadRef.current.clear();
        }
      }}
      ref={typeaheadRef}
      labelKey={(option) => option.metadata.asset.title}
      isLoading={exploreSearchState.isLoading}
      onSearch={handleSearch}
      options={exploreSearchState.options}
      placeholder="Search For Any Nft"
      renderMenuItemChildren={(option) => (
        <Fragment>
          <span>{option.metadata.asset.title}</span>
        </Fragment>
      )}
    />
  );
};

export default ExploreSearch;
