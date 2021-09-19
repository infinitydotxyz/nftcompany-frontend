import { CardData } from 'types/Nft.interface';
import { Filter } from 'components/FilterPanel/FilterPanel';
import React, { useContext, useState } from 'react';
import { TypeAheadOption } from 'services/Listings.service';
import { Order } from 'types/Nft.interface';

export interface ExploreSearchState {
  isLoading: boolean;
  options: TypeAheadOption[];
  query: string;
  collectionName: string;
  listedNfts: CardData[];
  selectedOption: TypeAheadOption | null;
}
export const defaultExploreSearchState: ExploreSearchState = {
  isLoading: false,
  options: [],
  query: '',
  collectionName: '',
  listedNfts: [],
  selectedOption: null
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
  const [filterState, setFilterState] = useState<Filter>();

  const value = { exploreSearchState, filterState, setExploreSearchState, setFilterState };
  return <AppSearchContext.Provider value={value}>{children}</AppSearchContext.Provider>;
}

export const FilterContext = React.createContext({});
