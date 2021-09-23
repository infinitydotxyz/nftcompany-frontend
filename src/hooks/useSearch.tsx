import { CardData } from 'types/Nft.interface';
import React, { useContext, useState } from 'react';
import { TypeAheadOption } from 'services/Listings.service';

export interface SearchState {
  isLoading: boolean;
  options: TypeAheadOption[];
  query: string;
  collectionName: string;
  dataList: CardData[];
  selectedOption: TypeAheadOption | null;
}

export interface SearchFilter {
  sortByLikes?: string;
  sortByPrice?: string;
  priceMin: number;
  priceMax: number;
  startAfter?: number;
  startAfterPrice?: number;
  limit?: number;
  user?: string;
}

export const defaultSearchState: SearchState = {
  isLoading: false,
  options: [],
  query: '',
  collectionName: '',
  dataList: [],
  selectedOption: null
};

export const defaultFilterState: SearchFilter = {
  sortByLikes: '',
  sortByPrice: '',
  priceMin: 0,
  priceMax: 1000000
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
