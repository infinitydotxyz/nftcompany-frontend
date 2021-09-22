import { CardData } from 'types/Nft.interface';
import React, { useContext, useState } from 'react';
import { TypeAheadOption } from 'services/Listings.service';

export interface ExploreSearchState {
  isLoading: boolean;
  options: TypeAheadOption[];
  query: string;
  collectionName: string;
  listedNfts: CardData[];
  selectedOption: TypeAheadOption | null;
}

export interface Filter {
  sortByLikes?: string;
  sortByPrice?: string;
  priceMin: number;
  priceMax: number;
  startAfter?: number;
  startAfterPrice?: number;
  limit?: number;
}
export const defaultExploreSearchState: ExploreSearchState = {
  isLoading: false,
  options: [],
  query: '',
  collectionName: '',
  listedNfts: [],
  selectedOption: null
};

export const defaultFilterState: Filter = {
  sortByLikes: '',
  sortByPrice: '',
  priceMin: 0,
  priceMax: 1000
};

// ExploreSearch
const AppSearchContext = React.createContext({} as any);

export function useAppSearchContext(): {
  exploreSearchState: ExploreSearchState;
  filterState: Filter;
  setExploreSearchState: (state: ExploreSearchState) => void;
  setFilterState: (state: Filter) => void;
} {
  return useContext(AppSearchContext);
}

export function FilterContextProvider({ children }: any) {
  const [exploreSearchState, setExploreSearchState] = useState<ExploreSearchState>(defaultExploreSearchState);
  const [filterState, setFilterState] = useState<Filter>(defaultFilterState);

  const value = { exploreSearchState, filterState, setExploreSearchState, setFilterState };

  return <AppSearchContext.Provider value={value}>{children}</AppSearchContext.Provider>;
}

export const FilterContext = React.createContext({});
