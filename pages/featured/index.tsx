import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, getLastItemCreatedAt, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import cardListStyles from '../../src/components/Card/CardList.module.scss';
import CollectionCard, { CollectionCardData, loadingCardData } from 'components/Card/CollectionCard';

type FeaturedPageProps = {
  asSection?: boolean;
};

export default function FeaturedPage({ asSection }: FeaturedPageProps) {
  const { showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CollectionCardData[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async () => {
    setIsFetching(true);
    const { result, error } = await apiGet(`/featured-collections`, {});
    setIsFetching(false);
    if (error) {
      showAppError(`${error?.message}`);
      return;
    }
    const collections = result.collections.map((item: CollectionCardData) => {
      return { ...item, hasBlueCheck: true }; // default: feature verified collections only.
    });
    setData(collections);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  const Container: React.FC<{}> = ({ children }) => {
    if (asSection === true) {
      return <>{children}</>;
    }
    return (
      <>
        <Head>
          <title>Featured</title>
        </Head>
        <div>
          <div className="page-container">{children}</div>
        </div>
      </>
    );
  };

  return (
    <Container>
      <div className="section-bar">
        <div className="tg-title">Featured</div>
      </div>

      <div className={cardListStyles.cardList}>
        {data?.length === 0 && isFetching ? (
          <>
            <CollectionCard key={'loading---1'} data={loadingCardData} isLoadingCard={true} />
            <CollectionCard key={'loading---2'} data={loadingCardData} isLoadingCard={true} />
          </>
        ) : null}

        {data.map((item) => {
          return <CollectionCard key={item.id} data={item} />;
        })}
      </div>

      {/* <div>
            <PleaseConnectWallet account={user?.account} />
            <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={data} />
            {data?.length === 0 && isFetching && <LoadingCardList />}

            <CardList data={data} action="CANCEL_OFFER" />
          </div>

          {dataLoaded && (
            <FetchMore
              currentPage={currentPage}
              data={data}
              onFetchMore={async () => {
                setDataLoaded(false);
                await fetchData();
              }}
            />
          )} */}
    </Container>
  );
}

// eslint-disable-next-line react/display-name
FeaturedPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
