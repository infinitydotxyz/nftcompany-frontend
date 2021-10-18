import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { NoData } from 'components/FetchMore/FetchMore';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import { useCardProvider } from 'hooks/useCardProvider';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { useAppContext } from 'utils/context/AppContext';
import { Spacer } from '@chakra-ui/layout';
import { CardGrid } from 'components/CollectionCards/CollectionCard';
import { CollectionCardEntry } from 'types/rewardTypes';
import { useSearchContext } from 'utils/context/SearchContext';

export default function ExplorePage() {
  const cardProvider = useCardProvider();
  const searchContext = useSearchContext();

  const collectionCards = cardProvider.list.map((x) => {
    return {
      id: x.id,
      name: x.collectionName,
      address: x.tokenAddress,
      cardImage: x.image,
      description: x.description,
      hasBlueCheck: x.hasBlueCheck
    } as CollectionCardEntry;
  });

  const text = searchContext.searchState.text;
  const enableSort = text?.length > 0;

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
            <SortMenuButton disabled={!enableSort} />
          </div>
          <NoData dataLoaded={cardProvider.hasLoaded} isFetching={!cardProvider.hasLoaded} data={cardProvider.list} />
          {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}
          {/* <CollectionCards rows={1} /> */}
          {/* <CardList showItems={['PRICE']} userAccount={user?.account} data={cardProvider.list} action="BUY_NFT" /> */}
          <CardGrid data={collectionCards} />;
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
