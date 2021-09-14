import React, { forwardRef, Fragment, useImperativeHandle, useRef, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { getListingsByTitle } from 'services/Listings.service';
import { Order } from 'types/Nft.interface';

interface Props {
  onChange: (titleQuery: Order) => void;
  onClear: (selectedOrder: Order) => void;
  ref?: any;
}
interface ExploreSearchState {
  isLoading: boolean;
  options: Order[];
  query: string;
}
const ExploreSearch = forwardRef(({ onChange, onClear }: Props, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      clearFromParent() {
        console.log('oy');
        resetState();
      }
    }),
    []
  );
  const typeaheadRef = useRef<any>();
  const [exploreSearchState, setExploreSearchState] = useState<ExploreSearchState>({
    isLoading: false,
    options: [],
    query: ''
  });
  const filterBy = () => true;
  const resetState = () => {
    setExploreSearchState({ options: [], isLoading: false, query: '' });
    typeaheadRef.current.clear();
  };
  const handleSearch = async (query: string) => {
    setExploreSearchState({ ...exploreSearchState, isLoading: true, query });
    const response: Order[] = (await getListingsByTitle({ startsWith: query })) as any;
    setExploreSearchState({
      ...exploreSearchState,
      isLoading: false,
      query,
      options: response
    });
  };
  return (
    <AsyncTypeahead
      id="explore-typeahead"
      onChange={(selected: Order[]) => {
        onChange(selected[0]);
      }}
      ref={typeaheadRef}
      filterBy={filterBy}
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
    //     </div>
  );
});

export default ExploreSearch;
