import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { NoData } from 'components/FetchMore/FetchMore';
import CardList from 'components/Card/CardList';
import { useSearchContext } from 'hooks/useSearch';
import { useAppContext } from 'utils/context/AppContext';
import styles from '../../styles/Dashboard.module.scss';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import { useCardProvider } from 'hooks/useCardProvider';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';

const SEARCH_ERROR_MESSAGE = 'Unable to fetch assets';

export default function ExplorePage() {
  const { user, showAppError } = useAppContext();
  const { searchState, setSearchState, filterState } = useSearchContext();
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const cardProvider = useCardProvider();

  // React.useEffect(() => {
  //   onSearch();
  // }, [searchState.collectionName, searchState.selectedOption, filterState.priceMin, filterState.priceMax]);

  // React.useEffect(() => {
  //   if (currentPage < 0 || searchState.dataList.length < currentPage * ITEMS_PER_PAGE) {
  //     return;
  //   }
  //   setDataLoaded(true); // current page's data loaded & rendered.
  // }, [currentPage]);

  // const fetchData = async (filter: SearchFilter, isRefreshing: boolean = false) => {
  //   setIsFetching(true);
  //   let newCurrentPage = currentPage + 1;

  //   if (isRefreshing) {
  //     newCurrentPage = 0;
  //     setDataLoaded(false);
  //   }

  //   let moreData = await getListings({
  //     ...filter,
  //     startAfter: isRefreshing ? '' : getLastItemCreatedAt(searchState.dataList),
  //     startAfterPrice: isRefreshing ? '' : getLastItemBasePrice(searchState.dataList),
  //     limit: ITEMS_PER_PAGE
  //   });

  //   // remove any owned by the current user
  //   if (user?.account && moreData && moreData.length > 0) {
  //     moreData = moreData.filter((item) => {
  //       // opensea lowercases their account strings, so compare to lower
  //       return item.owner?.toLowerCase() !== user.account.toLowerCase();
  //     });
  //   }

  //   setIsFetching(false);
  //   setSearchState({
  //     ...searchState,
  //     dataList: isRefreshing ? moreData : [...searchState.dataList, ...moreData]
  //   });
  //   setCurrentPage(newCurrentPage);
  // };

  // on Search changed:
  // const onSearch = async () => {
  //   setDataLoaded(false);
  //   setIsFetching(true);

  //   if (searchState.collectionName) {
  //     // they selected a collection search for collections
  //     const response = await getListingsByCollectionName(searchState.collectionName, filterState);

  //     if (response.length !== 0) {
  //       const cardData = response;
  //       setSearchState({ ...searchState, dataList: cardData });
  //     } else {
  //       showAppError(SEARCH_ERROR_MESSAGE);
  //     }
  //   } else if (searchState.selectedOption) {
  //     // they selected an asset search for that instead
  //     const response = await getListingById(searchState.selectedOption.id, searchState.selectedOption.address);

  //     if (response) {
  //       const cardData = orderToCardData(response);
  //       setSearchState({ ...searchState, dataList: [cardData] });
  //     } else {
  //       showAppError(SEARCH_ERROR_MESSAGE);
  //     }
  //   } else {
  //     // initial fetch, or after clearing search/filter:
  //     await fetchData(filterState, true);
  //   }
  //   setIsFetching(false);
  // };

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Explore</div>

            <div style={{ flex: 1 }} />
            <SortMenuButton />
            {/* <div className="left">
              <ul className="links">
                <li>
                  {!searchState.selectedOption && (
                    <Box>
                      <a className="active cpointer" onClick={() => setFilterShowed(!filterShowed)}>
                        SearchFilter <FilterIcon />
                      </a>
                    </Box>
                  )}
                </li>
              </ul>
            </div> */}
          </div>

          {/* {!searchState.selectedOption && (
            <Box mr="6" mt="5">
              <FilterPanel
                isExpanded={filterShowed}
                onChangeFilter={onChangeFilter}
                searchState={searchState}
              />
            </Box>
          )} */}

          <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={cardProvider.list} />
          {cardProvider.list.length === 0 && isFetching && <LoadingCardList />}

          <CardList showItems={['PRICE']} excludedMaker={user?.account} data={cardProvider.list} action="BUY_NFT" />

          {cardProvider.list.length > 0 && (
            <ScrollLoader
              onFetchMore={async () => {
                setDataLoaded(false);
                cardProvider.loadNext();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
ExplorePage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
