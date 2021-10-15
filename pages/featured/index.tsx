import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, getLastItemCreatedAt, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import cardListStyles from '../../src/components/Card/CardList.module.scss';
import CollectionCard, { CollectionCardData } from 'components/Card/CollectionCard';

export default function FeaturedPage() {
  const { user, showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CollectionCardData[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async () => {
    if (!user?.account) {
      setData([]);
      return;
    }
    setIsFetching(true);
    const { result, error } = await apiGet(`/featured-collections`, {});
    setIsFetching(false);

    setData(result.collections);

    if (error) {
      showAppError(`${error?.message}`);
      return;
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [user]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);
  return (
    <>
      <Head>
        <title>Featured</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Featured</div>
          </div>

          <div className={cardListStyles.cardList}>
            {data.map((item) => {
              return <CollectionCard data={item} />;
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
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
FeaturedPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
