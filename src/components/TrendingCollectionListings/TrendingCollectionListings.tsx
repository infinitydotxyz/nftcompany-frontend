import CardList from 'components/Card/CardList';
import { NoData } from 'components/FetchMore/FetchMore';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import React, { useEffect, useState } from 'react';
import { getTrendingCollections, TrendingCollectionResponse } from 'services/Collections.service';
import { useAppContext } from 'utils/context/AppContext';
import { useCardProvider } from 'hooks/useCardProvider';
import { defaultFilterState, defaultSearchState, ListingSource, SearchContextType } from 'utils/context/SearchContext';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';

export default function TrendingCollectionListings() {
  return (
    <>
      <div className="seaction-bar">
        <div className="tg-title">Trending Listings</div>
      </div>
      <TrendingCollectionContents />
    </>
  );
}

const TrendingCollectionContents = (): JSX.Element => {
  const trendingCollections = useTrendingCollections();
  const [isLoading, setIsLoading] = useState(true);

  const [searchContext, setSearchContext] = useState<Pick<SearchContextType, 'searchState' | 'filterState'>>({
    searchState: defaultSearchState,
    filterState: { ...defaultFilterState, limit: '50' }
  });

  const cardProvider = useCardProvider(ListingSource.OpenSea, searchContext);

  const { user } = useAppContext();

  useEffect(() => {
    if (cardProvider.list.length > 0) {
      setIsLoading(false);
    }
  }, [cardProvider.list]);

  useEffect(() => {
    setSearchContext((prev) => {
      const tokenAddresses = trendingCollections.map((collection) => collection.address);
      return { ...prev, filterState: { ...prev.filterState, tokenAddresses } };
    });
  }, [trendingCollections]);

  return (
    <>
      <NoData
        dataLoaded={cardProvider.hasLoaded}
        isFetching={isLoading || !cardProvider.hasLoaded}
        data={cardProvider.list}
      />

      {(isLoading || (!cardProvider.hasData() && !cardProvider.hasLoaded)) && <LoadingCardList />}

      <CardList showItems={['PRICE']} userAccount={user?.account} data={cardProvider.list} action="BUY_NFT" />

      {cardProvider.hasData() && (
        <ScrollLoader
          onFetchMore={async () => {
            cardProvider.loadNext();
          }}
        />
      )}
    </>
  );
};

function useTrendingCollections() {
  const [trendingCollections, setTrendingCollections] = useState<TrendingCollectionResponse[]>([]);

  useEffect(() => {
    let isActive = true;
    const fetchTrendingCollections = async () => {
      const result = await getTrendingCollections();
      if (isActive) {
        setTrendingCollections(result);
      }
    };
    fetchTrendingCollections();

    return () => {
      isActive = false;
    };
  }, []);

  return trendingCollections;
}
