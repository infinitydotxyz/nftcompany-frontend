import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { NoData } from 'components/FetchMore/FetchMore';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import { useCardProvider } from 'hooks/useCardProvider';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { useAppContext } from 'utils/context/AppContext';
import { CardGrid } from 'components/CollectionCards/CollectionCard';
import { CollectionCardEntry } from 'types/rewardTypes';
import { ListingSource, useSearchContext } from 'utils/context/SearchContext';
import CardList from 'components/Card/CardList';
import { Spacer } from '@chakra-ui/react';
import FeaturedCollections from 'components/FeaturedCollections/FeaturedCollections';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import { NftAction } from 'types';
import styles from './Explore.module.scss';

export default function ExplorePage() {
  const searchContext = useSearchContext();
  const [tabIndex, setTabIndex] = useState(0);
  const { user } = useAppContext();
  const [isFilterOpened, setIsFilterOpened] = React.useState(false);

  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    let shouldUseSearchMode =
      searchContext.searchState.text?.length > 0 ||
      searchContext.searchState.collectionName?.length > 0 ||
      searchContext.filterState?.collectionName?.length > 0 ||
      searchContext.filterState.priceMin !== '' ||
      searchContext.filterState.priceMax !== '' ||
      !!searchContext.filterState.collectionIds ||
      searchContext.searchState.query?.length > 0;

    shouldUseSearchMode = shouldUseSearchMode || searchContext.filterState.listType !== '';
    setSearchMode(shouldUseSearchMode);
  }, [searchContext]);

  const Explore = (props: { listingSource: ListingSource }) => {
    const cardProvider = useCardProvider(props.listingSource, searchContext);
    const [collectionCards, setCollectionCards] = useState<CollectionCardEntry[]>([]);
    useEffect(() => {
      let isMounted = true;

      if (isMounted) {
        const collCards = cardProvider.list.map((x) => {
          return {
            id: x.id,
            name: x.collectionName,
            address: x.tokenAddress,
            cardImage: x.image,
            description: x.description,
            hasBlueCheck: x.hasBlueCheck,
            chainId: x.chainId
          } as CollectionCardEntry;
        });
        setCollectionCards(collCards);
      }
      return () => {
        isMounted = false;
      };
    }, [cardProvider.list]);

    return (
      <>
        <div className="section-bar">
          <div className="tg-title">Explore</div>
          <Spacer />
          <SortMenuButton disabled={!searchMode || props.listingSource === ListingSource.OpenSea} />
        </div>
        <NoData dataLoaded={cardProvider.hasLoaded} isFetching={!cardProvider.hasLoaded} data={cardProvider.list} />
        {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}

        {searchMode ? (
          <CardList
            showItems={['PRICE']}
            userAccount={user?.account}
            data={cardProvider.list}
            action={NftAction.BuyNft}
          />
        ) : (
          <CardGrid data={collectionCards} />
        )}

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

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>

      <div className={`${styles.main} page-wrapper`}>
        {isFilterOpened && <div className="filter-placeholder"></div>}

        <div className="page-container">
          {!searchMode && <FeaturedCollections />}
          <Explore listingSource={ListingSource.Infinity} />
        </div>
      </div>

      <div className="filter-panel-explore-page">
        <FilterDrawer onToggle={(isOpen) => setIsFilterOpened(isOpen)} />
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
ExplorePage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
