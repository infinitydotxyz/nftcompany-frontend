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
import { CollectionCardEntry } from '@infinityxyz/lib/types/core';
import { ListingSource, useSearchContext } from 'utils/context/SearchContext';
import CardList from 'components/Card/CardList';
import { Spacer, Box } from '@chakra-ui/react';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import { NftAction } from 'types';
import styles from './Explore.module.scss';
import { PAGE_NAMES } from 'utils/constants';
import FilterPills from 'components/FilterDrawer/FilterPills';

export default function ExplorePage() {
  const searchContext = useSearchContext();
  const { user } = useAppContext();
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
        <FilterPills />

        <NoData dataLoaded={cardProvider.hasLoaded} isFetching={!cardProvider.hasLoaded} data={cardProvider.list} />
        {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}

        {searchMode ? (
          <CardList
            showItems={['PRICE']}
            userAccount={user?.account}
            data={cardProvider.list}
            action={NftAction.BuyNft}
            pageName={PAGE_NAMES.EXPLORE}
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

      <div className={`${styles.main}`}>
        <div className="page-container">
          {/* {!searchMode && <FeaturedCollections />} */}

          <div className="section-bar">
            <div className="tg-title">Explore</div>
            <Spacer />
            <SortMenuButton
              disabled={!searchMode}
              filterState={searchContext.filterState}
              setFilterState={searchContext.setFilterState}
            />
          </div>

          <Box className={styles.col}>
            <Box className="filter-container">
              <FilterDrawer pageName={PAGE_NAMES.EXPLORE} />
            </Box>
            <Box className="content-container">
              <Explore listingSource={ListingSource.Infinity} />
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
ExplorePage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
