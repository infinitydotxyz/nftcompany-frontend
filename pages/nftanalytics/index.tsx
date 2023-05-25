import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { TrendingList } from 'components/TrendingList';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { PageHeader } from 'components/PageHeader';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';

const TrendingPage = (): JSX.Element => {
  const { user, showAppError } = useAppContext();

  return (
    <>
      <Head>
        <title>Analytics</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <PageHeader title="Analytics" />
          <PleaseConnectWallet account={user?.account} />

          <TrendingList />
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
TrendingPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default TrendingPage;
