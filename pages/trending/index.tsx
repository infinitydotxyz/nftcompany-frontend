import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import TrendingTable from 'components/TrendingTable/TrendingTable';

const TrendingPage = (): JSX.Element => {
  const { user, showAppError } = useAppContext();

  if (!user) {
    return <div />;
  }

  return (
    <>
      <Head>
        <title>Trending</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Trending</div>
          </div>
          <TrendingTable />
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
TrendingPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default TrendingPage;
