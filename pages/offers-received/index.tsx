import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, getLastItemCreatedAt, NoData } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';

import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';
import { ordersToCardData } from 'services/Listings.service';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';

export default function OffersReceived() {
  const { user, showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async () => {
    if (!user?.account) {
      setData([]);
      return;
    }
    setIsFetching(true);
    let listingData = [];
    const newCurrentPage = currentPage + 1;
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/offersreceived`, {
        startAfter: getLastItemCreatedAt(data),
        limit: ITEMS_PER_PAGE
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
    console.log('- Offers Received - user:', user);
    fetchData();
  }, [user]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);
  return (
    <>
      <Head>
        <title>Offers Received</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="">
              <div className="tg-title">Offers Received</div>
            </div>

            <div className="center">&nbsp;</div>

            <div className="left">{/* TBD */}</div>
          </div>

          <div className={styles.main}>
            <NoData isFetching={isFetching} data={data} currentPage={currentPage} />
            {data?.length === 0 && isFetching && <LoadingCardList />}

            <CardList data={data} actions={['ACCEPT_OFFER']} />
          </div>

          {dataLoaded && (
            <FetchMore
              currentPage={currentPage}
              onFetchMore={async () => {
                setDataLoaded(false);
                await fetchData();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
OffersReceived.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
