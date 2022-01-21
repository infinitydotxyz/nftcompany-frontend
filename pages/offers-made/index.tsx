import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, getLastItemCreatedAt, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import { ordersToCardData } from 'services/Listings.service';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { NftAction } from 'types';
import { Box } from '@chakra-ui/react';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import styles from './OffersMade.module.scss';
import { SearchFilter, useSearchContext } from 'utils/context/SearchContext';

export default function OffersMade() {
  const { user, showAppError } = useAppContext();
  const searchContext = useSearchContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async (searchFilter: SearchFilter) => {
    if (!user?.account) {
      setData([]);
      return;
    }
    setIsFetching(true);
    let listingData = [];
    const newCurrentPage = currentPage + 1;
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/offersmade`, {
        ...searchFilter
      });
      if (error) {
        showAppError(`${error?.message}`);
        return;
      }
      listingData = result?.listings || [];
    } catch (e) {
      console.error(e);
    }
    const moreData = ordersToCardData(listingData || []);
    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    fetchData(searchContext.filterState);
  }, [user, searchContext]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Offers Made</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Offers Made</div>
          </div>

          <Box className={styles.col}>
            <Box className="filter-container">
              <FilterDrawer showSaleTypes={false} />
            </Box>
            <Box className="content-container">
              <div>
                <PleaseConnectWallet account={user?.account} />
                <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={data} />
                {data?.length === 0 && isFetching && <LoadingCardList />}

                <CardList data={data} action={NftAction.CancelOffer} userAccount={user?.account} />
              </div>

              {dataLoaded && (
                <FetchMore
                  currentPage={currentPage}
                  data={data}
                  onFetchMore={async () => {
                    setDataLoaded(false);
                    await fetchData(searchContext.filterState);
                  }}
                />
              )}
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
OffersMade.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
