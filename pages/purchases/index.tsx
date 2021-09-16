import React, { useState } from 'react';
import { NextPage } from 'next';
import { useToast } from '@chakra-ui/toast';
import { showMessage } from 'utils/commonUtil';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/spinner';
import CardList from 'components/Card/CardList';
import { apiGet } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';

import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';
import { ordersToCardData } from 'services/Listings.service';

export default function Purchases() {
  const { user } = useAppContext();
  const toast = useToast();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);

  const fetchData = async () => {
    if (!user?.account) {
      setData([]);
      return;
    }
    setIsFetching(true);
    let listingData = [];
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/offersmade`);
      if (error) {
        showMessage(toast, 'error', `${error}`);
        return;
      }
      listingData = result?.listings || [];
      console.log('listingData', listingData);
    } catch (e) {
      console.error(e);
    }
    const data = ordersToCardData(listingData || []);
    console.log('data', data);
    setIsFetching(false);
    setData(data);
  };

  React.useEffect(() => {
    console.log('- Purchases - user:', user);
    fetchData();
  }, [user]);
  return (
    <>
      <Head>
        <title>Purchases</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="">
              <div className="tg-title">Purchases</div>
            </div>

            <div className="center">&nbsp;</div>

            <div className="left">{/* TBD */}</div>
          </div>

          <div className={styles.main}>
            {isFetching ? <Spinner size="md" color="gray.800" /> : <CardList data={data} actions={['VIEW_ORDER']} />}
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Purchases.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
