import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { PageHeader } from 'components/PageHeader';
import { apiPost } from 'utils/apiUtil';
import { BuyOrder, SellOrder } from '@infinityxyz/lib/types/core';
import { Button } from '@chakra-ui/button';

const MarketPage = (): JSX.Element => {
  const { user, showAppError } = useAppContext();

  const buy = async () => {
    const order: BuyOrder = {
      user: user?.account ?? '',
      budget: 12,
      collections: ['apes', 'goop'],
      expiration: Date.now(),
      minNFTs: 2
    };

    const body = {
      buyOrder: order
    };

    const response = await apiPost(`/u/${user?.account}/market`, null, body);

    console.log(response);

    if (response.status === 200) {
      showAppError(`buy successful.`);
    } else {
      console.log('An error occured: buy');
    }
  };

  const sell = async () => {
    const order: SellOrder = {
      user: user?.account ?? '',
      collection: 'goop',
      expiration: Date.now(),
      nftAddress: '0xalskdjflkasjdlfkjasdlf',
      price: 232.999
    };

    const body = {
      buyOrder: order
    };

    const response = await apiPost(`/u/${user?.account}/market`, null, body);

    console.log(response);

    if (response.status === 200) {
      showAppError(`sell successful.`);
    } else {
      console.log('An error occured: sell');
    }
  };

  return (
    <>
      <Head>
        <title>Trending</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <PageHeader title="Market" />
          <PleaseConnectWallet account={user?.account} />

          <Button
            onClick={() => {
              buy();
            }}
          >
            Buy
          </Button>

          <Button
            onClick={() => {
              sell();
            }}
          >
            Sell
          </Button>
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
MarketPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default MarketPage;
