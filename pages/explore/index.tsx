import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { NoData } from 'components/FetchMore/FetchMore';
import CardList from 'components/Card/CardList';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import { useCardProvider } from 'hooks/useCardProvider';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { useAppContext } from 'utils/context/AppContext';
import { Spacer } from '@chakra-ui/layout';
import { useRouter } from 'next/router';

export default function ExplorePage() {
  const cardProvider = useCardProvider();
  const { user } = useAppContext();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Explore</div>

            <Spacer />
            <SortMenuButton />
          </div>

          <NoData dataLoaded={cardProvider.hasLoaded} isFetching={!cardProvider.hasLoaded} data={cardProvider.list} />

          {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}

          <CardList showItems={['PRICE']} userAccount={user?.account} data={cardProvider.list} action="BUY_NFT" />

          {cardProvider.hasData() && (
            <ScrollLoader
              onFetchMore={async () => {
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
