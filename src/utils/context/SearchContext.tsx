import React, { useContext, useState } from 'react';
import { TypeAheadOption } from 'services/Listings.service';

export type SearchState = {
  isLoading: boolean;
  options: TypeAheadOption[];
  query: string;
  collectionName: string;
  text: string;
  selectedOption: TypeAheadOption | undefined;
};

export enum ListingSource {
  Infinity = 'infinity',
  OpenSea = 'opensea'
}

export type SearchFilter = {
  sortByLikes: string;
  sortByPrice: string;
  priceMin: string;
  priceMax: string;
  startAfterMillis: string;
  startAfterPrice: string;
  startAfterSearchTitle: string;
  startAfterSearchCollectionName: string;
  startAfterBlueCheck: boolean | undefined;
  limit: string;
  user: string;
  id: string;
  chainId: string;
  tokenId: string;
  tokenAddress: string;
  tokenAddresses?: string[];
  collectionName: string;
  text: string;
  sortByPriceDirection: string;
  startAfterUser: string;
  collectionIds: string;
  listType?: '' | 'fixedPrice' | 'englishAuction' | 'dutchAuction';
  traitType?: string;
  traitValue?: string;
  pageName?: string;
};

export const defaultSearchState: SearchState = {
  isLoading: false,
  options: [],
  query: '',
  collectionName: '',
  text: '',
  selectedOption: undefined
};

export const defaultFilterState: SearchFilter = {
  sortByLikes: '',
  sortByPrice: '',
  priceMin: '',
  priceMax: '',
  collectionName: '',
  text: '',
  limit: '',
  sortByPriceDirection: '',
  startAfterMillis: '',
  startAfterPrice: '',
  startAfterUser: '',
  id: '',
  user: '',
  chainId: '',
  tokenAddress: '',
  tokenId: '',
  startAfterSearchTitle: '',
  startAfterSearchCollectionName: '',
  startAfterBlueCheck: undefined,
  listType: '',
  collectionIds: '',
  traitType: '',
  traitValue: '',
  pageName: ''
};

const SearchContext = React.createContext({} as any);

export function SearchContextProvider({ children }: any) {
  const [searchState, setSearchState] = useState<SearchState>(defaultSearchState);
  const [filterState, setFilterState] = useState<SearchFilter>(defaultFilterState);

  const value = { searchState, filterState, setSearchState, setFilterState };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export type SearchContextType = {
  searchState: SearchState;
  filterState: SearchFilter;
  setSearchState: (state: SearchState) => void;
  setFilterState: (state: SearchFilter) => void;
};

export function useSearchContext(): SearchContextType {
  return useContext(SearchContext);
}

export const getDefaultFilterState = (existingFilterState: SearchFilter) => {
  const newFilter: SearchFilter = { ...defaultFilterState, ...existingFilterState };
  return newFilter;
};
