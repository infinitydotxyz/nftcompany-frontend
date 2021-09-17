import React, { useState } from 'react';
import { NextPage } from 'next';
import { useToast } from '@chakra-ui/toast';
import { showMessage } from 'utils/commonUtil';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/spinner';
import CardList from 'components/Card/CardList';
import { apiGet, apiDelete } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';

import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';
import { ordersToCardData } from 'services/Listings.service';

export default function OffersMade() {
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
      const { result, error } = await apiGet(`/u/${user?.account}/offersmade`, {
        startAfter: data?.length > 0 ? data[data.length - 1]?.metadata?.createdAt : '',
        limit: ITEMS_PER_PAGE
      });
      if (error) {
        showAppError(`${error?.message}`);
        return;
      }
      listingData = result?.listings || [];
      console.log('listingData', listingData);
    } catch (e) {
      console.error(e);
    }
    const moreData = ordersToCardData(listingData || []);
    console.log('moreData', moreData);
    setIsFetching(false);
    setData([ ...data, ...moreData ]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    console.log('- Offers Made - user:', user);
    fetchData();
  }, [user]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    console.log('currentPage loaded:', currentPage);
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);
  return (
    <>
      <Head>
        <title>Offers Made</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="">
              <div className="tg-title">Offers Made</div>
            </div>

            <div className="center">&nbsp;</div>

            <div className="left">{/* TBD */}</div>
          </div>

          <div className={styles.main}>
            {/* {isFetching ? <Spinner size="md" color="gray.800" /> : <CardList data={data} actions={['CANCEL_OFFER']} />} */}
            <CardList data={data} actions={['CANCEL_OFFER']} />
          </div>

          {dataLoaded && (
            <FetchMore
              currentPage={currentPage}
              onFetchMore={async () => {
                console.log('onFetchMore()');
                await setDataLoaded(false);
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
OffersMade.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
