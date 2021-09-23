import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { NoData } from 'components/FetchMore/FetchMore';
import CardList from 'components/Card/CardList';
import { useAppContext } from 'utils/context/AppContext';
import styles from '../../styles/Dashboard.module.scss';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import { useCardProvider } from 'hooks/useCardProvider';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';

export default function ExplorePage() {
  const { user, showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const cardProvider = useCardProvider();

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
          </div>

          <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={cardProvider.list} />
          {!cardProvider.hasData() && isFetching && <LoadingCardList />}

          <CardList showItems={['PRICE']} data={cardProvider.list} action="BUY_NFT" />

          {cardProvider.hasData() && (
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
