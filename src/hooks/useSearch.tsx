import { CardData } from 'components/Card/Card';
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
const ExploreSearchContext = React.createContext<any>(defaultExploreSearchState);
const SetExploreSearchContext = React.createContext<any>(() => {});

export function useExploreSearchContext(): ExploreSearchState {
  return useContext(ExploreSearchContext);
}
export function useSetExploreSearchContext() {
  return useContext(SetExploreSearchContext);
}
// Filter
const FilterStateContext = React.createContext<any>(null);
const SetFilterContext = React.createContext<any>(null);

export function useFilterContext() {
  return useContext(FilterStateContext);
}
export function useSetFilterContext() {
  return useContext(SetFilterContext);
}

export function FilterContextProvider({ children }: any) {
  const [exploreSearchState, setExploreSearchState] = useState<ExploreSearchState>(defaultExploreSearchState);
  //   TODO move filter state into this
  const [filterState, setFilterState] = useState<Filter>();

  function setExploreSearch(exploreSearchState: ExploreSearchState) {
    setExploreSearchState(exploreSearchState);
  }
  return (
    <ExploreSearchContext.Provider value={exploreSearchState}>
      <FilterStateContext.Provider value={filterState}>
        <SetFilterContext.Provider value={setFilterState}>
          <SetExploreSearchContext.Provider value={setExploreSearch}>{children}</SetExploreSearchContext.Provider>
        </SetFilterContext.Provider>
      </FilterStateContext.Provider>
    </ExploreSearchContext.Provider>
  );
}

export const FilterContext = React.createContext({});
