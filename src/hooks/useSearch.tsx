import { CardData } from 'types/Nft.interface';
import React, { useContext, useState } from 'react';
import { TypeAheadOption } from 'services/Listings.service';

export type SearchState = {
  isLoading: boolean;
  options: TypeAheadOption[];
  query: string;
  collectionName: string;
  selectedOption: TypeAheadOption | undefined;
};

export type SearchFilter = {
  sortByLikes: string;
  sortByPrice: string;
  priceMin: string;
  priceMax: string;
  startAfterMillis: string;
  startAfterPrice: string;
  limit: string;
  user: string;
  id: string;
  tokenId: string;
  tokenAddress: string;
  collectionName: string;
  sortByPriceDirection: string;
  startAfterUser: string;
};

export const defaultSearchState: SearchState = {
  isLoading: false,
  options: [],
  query: '',
  collectionName: '',
  selectedOption: undefined
};

export const defaultFilterState: SearchFilter = {
  sortByLikes: '',
  sortByPrice: '',
  priceMin: '',
  priceMax: '',
  collectionName: '',
  limit: '',
  sortByPriceDirection: '',
  startAfterMillis: '',
  startAfterPrice: '',
  startAfterUser: '',
  id: '',
  user: '',
  tokenAddress: '',
  tokenId: ''
};

const SearchContext = React.createContext({} as any);

export function useSearchContext(): {
  searchState: SearchState;
  filterState: SearchFilter;
  setSearchState: (state: SearchState) => void;
  setFilterState: (state: SearchFilter) => void;
} {
  return useContext(SearchContext);
}

export function SearchContextProvider({ children }: any) {
  const [searchState, setSearchState] = useState<SearchState>(defaultSearchState);
  const [filterState, setFilterState] = useState<SearchFilter>(defaultFilterState);

  const value = { searchState, filterState, setSearchState, setFilterState };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
