import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Box, Spinner } from '@chakra-ui/react';
// import { Select } from '@chakra-ui/react';
import CardList from 'components/Card/CardList';
import FilterPanel, { Filter } from 'components/FilterPanel/FilterPanel';
import { FilterIcon } from 'components/Icons/Icons';
import styles from '../../styles/Dashboard.module.scss';
import { getListingById, getListings, getListingsByCollectionName, orderToCardData } from 'services/Listings.service';
import { useAppSearchContext } from 'hooks/useSearch';
import { useAppContext } from 'utils/context/AppContext';
const SEARCH_ERROR_MESSAGE = 'Unable to fetch assets';
export default function Dashboard() {
  const [tabIndex, setTabIndex] = useState(1);
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { exploreSearchState, setExploreSearchState, setFilterState, filterState } = useAppSearchContext();
  const { showAppError } = useAppContext();

  const title = React.useMemo(() => {
    switch (tabIndex) {
      case 1:
        return 'Hot Items 🔥';
        break;
      case 2:
        return 'Artistic 🎨';
        break;
      case 3:
        return 'Coins 🪙';
        break;
      case 4:
        return 'Games 🎮';
        break;
      case 5:
        return 'Music 🎵';
        break;

      default:
        break;
    }
  }, [tabIndex]);
  React.useEffect(() => {
    onSearch();
  }, [exploreSearchState.collectionName, exploreSearchState.selectedOption]);

  React.useEffect(() => {
    onSearch();
  }, []);
  const onSearch = async () => {
    setIsFetching(true);
    if (exploreSearchState.collectionName) {
      // they selected a collection search for collections
      const response = await getListingsByCollectionName(exploreSearchState.collectionName);
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
      const response = await getListings();
      if (response.length !== 0) {
        setExploreSearchState({ ...exploreSearchState, listedNfts: response });
      } else {
        showAppError(SEARCH_ERROR_MESSAGE);
      }
    }
    setFilterState({ sortByLikes: '', sortByPrice: '', price: 0 });
    setIsFetching(false);
  };

  const onFilterSearch = async (filter?: Filter) => {
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
      response = await getListings(filter);
      if (response.length !== 0) {
        setExploreSearchState({ ...exploreSearchState, listedNfts: response });
      } else {
        showAppError(SEARCH_ERROR_MESSAGE);
      }
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
              <div className="tg-title">{title}</div>
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
            <Box mr="6">
              <FilterPanel
                filter={filterState}
                setFilters={setFilterState}
                isExpanded={filterShowed}
                getNftListings={onFilterSearch}
                exploreSearchState={exploreSearchState}
              />
            </Box>
          )}
          {isFetching ? (
            <Spinner size="md" color="gray.800" />
          ) : (
            <CardList showItems={[]} data={exploreSearchState.listedNfts} actions={['BUY_NFT']} />
          )}
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Dashboard.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
