import CardList from 'components/Card/CardList';
import { NoData } from 'components/FetchMore/FetchMore';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import React, { useEffect, useState } from 'react';
import { getTrendingCollections, TrendingCollectionResponse } from 'services/Collections.service';
import { getListings } from 'services/Listings.service';
import { useAppContext } from 'utils/context/AppContext';
import { useCardProvider } from 'hooks/useCardProvider';
import { ListingSource } from 'utils/context/SearchContext';
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

function useTrendingCollections() {
  const [trendingCollections, setTrendingCollections] = useState<TrendingCollectionResponse[]>([]);

  useEffect(() => {
    const fetchTrendingCollections = async () => {
      const result = await getTrendingCollections();
      setTrendingCollections(result);
    };
    fetchTrendingCollections();
  }, []);

  return trendingCollections;
}

type Props = {};

const TrendingCollectionContents = (props: Props): JSX.Element => {
  const trendincCollections = useTrendingCollections();
  const cardProvider = useCardProvider(
    ListingSource.OpenSea,
    {
      isLoading: false,
      options: [],
      query: '',
      collectionName: '',
      text: '',
      selectedOption: undefined
    },
    {
      sortByLikes: '',
      sortByPrice: '',
      priceMin: '',
      priceMax: '',
      startAfterMillis: '',
      startAfterPrice: '',
      startAfterSearchTitle: '',
      startAfterSearchCollectionName: '',
      startAfterBlueCheck: undefined,
      limit: '50',
      user: '',
      id: '',
      tokenId: '',
      tokenAddress: '',
      tokenAddresses: trendincCollections.map((collection) => collection.address),
      collectionName: '',
      text: '',
      sortByPriceDirection: '',
      startAfterUser: '',
      offset: 0
    }
  );
  const { user } = useAppContext();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollectionContents = async () => {
      const listings = await getListings({
        sortByLikes: '',
        sortByPrice: '',
        priceMin: '',
        priceMax: '',
        startAfterMillis: '',
        startAfterPrice: '',
        startAfterSearchTitle: '',
        startAfterSearchCollectionName: '',
        startAfterBlueCheck: undefined,
        limit: '50',
        user: '',
        id: '',
        tokenId: '',
        tokenAddress: '',
        tokenAddresses: trendincCollections.map((collection) => collection.address),
        collectionName: '',
        text: '',
        sortByPriceDirection: '',
        startAfterUser: '',
        offset: 0
      });
      setList(listings);
    };

    fetchCollectionContents();
  }, [trendincCollections]);

  return (
    <>
      <NoData dataLoaded={cardProvider.hasLoaded} isFetching={!cardProvider.hasLoaded} data={cardProvider.list} />

      {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}

      <CardList showItems={['PRICE']} userAccount={user?.account} data={list} action="BUY_NFT" />

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
