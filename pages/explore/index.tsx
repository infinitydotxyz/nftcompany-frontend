import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Box, Spinner } from '@chakra-ui/react';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, getLastItemBasePrice, getLastItemCreatedAt, NoData } from 'components/FetchMore/FetchMore';
// import { Select } from '@chakra-ui/react';
import CardList from 'components/Card/CardList';
import FilterPanel from 'components/FilterPanel/FilterPanel';
import { FilterIcon } from 'components/Icons/Icons';
import { getListingById, getListings, getListingsByCollectionName, orderToCardData } from 'services/Listings.service';
import { Filter, useAppSearchContext } from 'hooks/useSearch';
import { useAppContext } from 'utils/context/AppContext';

import styles from '../../styles/Dashboard.module.scss';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import PriceSlider from 'components/FilterPanel/PriceSlider';

const SEARCH_ERROR_MESSAGE = 'Unable to fetch assets';

export default function Dashboard() {
  const { user, showAppError } = useAppContext();
  const { exploreSearchState, setExploreSearchState, filterState } = useAppSearchContext();
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  React.useEffect(() => {
    onSearch();
  }, [
    exploreSearchState.collectionName,
    exploreSearchState.selectedOption,
    filterState.priceMin,
    filterState.priceMax
  ]);

  React.useEffect(() => {
    // fetchData();
  }, [user]);

  React.useEffect(() => {
    if (currentPage < 0 || exploreSearchState.listedNfts.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  const fetchData = async (filter: Filter | undefined, isRefreshing: boolean = false) => {
    setIsFetching(true);
    let newCurrentPage = currentPage + 1;
    if (isRefreshing) {
      newCurrentPage = 0;
      setDataLoaded(false);
    }
    const moreData = await getListings({
      ...(filter as Filter),
      startAfter: isRefreshing ? '' : getLastItemCreatedAt(exploreSearchState.listedNfts),
      startAfterPrice: isRefreshing ? '' : getLastItemBasePrice(exploreSearchState.listedNfts),
      limit: ITEMS_PER_PAGE
    });
    setIsFetching(false);
    setExploreSearchState({
      ...exploreSearchState,
      listedNfts: isRefreshing ? moreData : [...exploreSearchState.listedNfts, ...moreData]
    });
    setCurrentPage(newCurrentPage);
  };

  // on Search changed:
  const onSearch = async () => {
    setDataLoaded(false);
    setIsFetching(true);
    if (exploreSearchState.collectionName) {
      // they selected a collection search for collections
      const response = await getListingsByCollectionName(exploreSearchState.collectionName, filterState);
      if (response.length !== 0) {
        const cardData = response;
        setExploreSearchState({ ...exploreSearchState, listedNfts: cardData });
      } else {
        showAppError(SEARCH_ERROR_MESSAGE);
      }
    } else if (exploreSearchState.selectedOption) {
      // they selected an asset search for that instead

      const response = await getListingById(
        exploreSearchState.selectedOption.id,
        exploreSearchState.selectedOption.address
      );
      if (response) {
        const cardData = orderToCardData(response);
        setExploreSearchState({ ...exploreSearchState, listedNfts: [cardData] });
      } else {
        showAppError(SEARCH_ERROR_MESSAGE);
      }
    } else {
      // initial fetch, or after clearing search/filter:
      await fetchData(filterState, true);
    }
    setIsFetching(false);
  };

  const onChangeFilter = async (filter?: Filter) => {
    setIsFetching(true);
    let response;
    if (exploreSearchState.collectionName) {
      response = await getListingsByCollectionName(exploreSearchState.collectionName, filter);
      if (response.length !== 0) {
        setExploreSearchState({
          ...exploreSearchState,
          listedNfts: response,
          collectionName: exploreSearchState.collectionName
        });
      } else {
        showAppError(SEARCH_ERROR_MESSAGE);
      }
    } else {
      console.log('onChangeFilter - fetchData(filter)');
      await fetchData(filter, true);
    }
    setIsFetching(false);
  };

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">
              <div className="tg-title">Explore</div>
            </div>

            <div className="center"></div>

            <div className="left">
              <div className="center" style={{ flex: 1, marginRight: 30 }}>
                <ul className="links">
                  <li>
                    {!exploreSearchState.selectedOption && (
                      <Box mr="6">
                        <a className="active cpointer" onClick={() => setFilterShowed(!filterShowed)}>
                          Filter <FilterIcon />
                        </a>
                      </Box>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {!exploreSearchState.selectedOption && (
            <Box mr="6" mt="5">
              <FilterPanel
                isExpanded={filterShowed}
                onChangeFilter={onChangeFilter}
                exploreSearchState={exploreSearchState}
              />
            </Box>
          )}

          <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={exploreSearchState.listedNfts} />
          {exploreSearchState.listedNfts?.length === 0 && isFetching && <LoadingCardList />}

          <CardList showItems={['PRICE']} data={exploreSearchState.listedNfts} actions={['BUY_NFT']} />

          {dataLoaded && (
            <FetchMore
              currentPage={currentPage}
              data={exploreSearchState.listedNfts}
              onFetchMore={async () => {
                setDataLoaded(false);
                await fetchData(filterState ? filterState : ({} as Filter));
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Dashboard.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
