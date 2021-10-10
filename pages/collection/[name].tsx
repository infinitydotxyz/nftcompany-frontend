import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { NoData } from 'components/FetchMore/FetchMore';
import CardList from 'components/Card/CardList';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { useCardProvider } from 'hooks/useCardProvider';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { useAppContext } from 'utils/context/AppContext';
import { useRouter } from 'next/router';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';

const Collection = (): JSX.Element => {
  const [title, setTitle] = useState<string | undefined>();
  const router = useRouter();
  const {
    query: { name }
  } = router;

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">{title || name}</div>

            <div style={{ flex: 1 }} />

            <SortMenuButton />
          </div>

          {name && (
            <CollectionContents
              name={name as string}
              onTitle={(newTitle) => {
                if (!title) {
                  setTitle(newTitle);
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
Collection.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Collection;

// =============================================================

type Props = {
  name: string;
  onTitle: (title: string) => void;
};

const CollectionContents = ({ name, onTitle }: Props): JSX.Element => {
  const cardProvider = useCardProvider(name as string);
  const { user } = useAppContext();

  if (cardProvider.hasLoaded) {
    if (cardProvider.list.length > 0) {
      const title = cardProvider.list[0].collectionName;

      if (title) {
        onTitle(title);
      }
    }
  }

  return (
    <>
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
    </>
  );
};
