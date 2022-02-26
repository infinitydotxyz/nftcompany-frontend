import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { TrendingList } from 'components/TrendingList';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';

const WatchlistPage = (): JSX.Element => {
  const { user, showAppError } = useAppContext();

  return (
    <>
      <Head>
        <title>Watchlist</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Watchlist</div>
          </div>
          <PleaseConnectWallet account={user?.account} />

          <TrendingList />
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
WatchlistPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default WatchlistPage;
