import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import { apiGet } from 'utils/apiUtil';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, getLastItemCreatedAt, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import { ordersToCardData } from 'services/Listings.service';
import styles from '../../styles/Dashboard.module.scss';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { CardData } from 'types/Nft.interface';

export default function ListNFTs() {
  const { user, showAppError } = useAppContext();
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [deleteModalItem, setDeleteModalItem] = useState<CardData | null>(null);

  const fetchData = async (isRefreshing: boolean = false) => {
    if (!user?.account) {
      setData([]);
      return;
    }
    setIsFetching(true);
    let listingData = [];
    let newCurrentPage = currentPage + 1;
    if (isRefreshing) {
      newCurrentPage = 0;
      setDataLoaded(false);
    }
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/listings`, {
        startAfter: isRefreshing ? '' : getLastItemCreatedAt(data),
        limit: ITEMS_PER_PAGE
      });
      if (error) {
        showAppError(`Failed to fetch listings. ${error?.message}.`);
        return;
      }
      listingData = result?.listings || [];
    } catch (e) {
      console.error(e);
    }
    const moreData = ordersToCardData(listingData || []);

    setIsFetching(false);
    setData(isRefreshing ? moreData : [...data, ...moreData]);
    setCurrentPage(newCurrentPage);
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
        <title>Listed NFTs</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Listed NFTs</div>
          </div>

          <div className={styles.main}>
            <PleaseConnectWallet account={user?.account} />
            <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={data} />
            {data?.length === 0 && isFetching && <LoadingCardList />}

            <CardList
              data={data}
              action="CANCEL_LISTING"
              onClickAction={async (item, action) => {
                console.log('item, action', item, action);
                setDeleteModalItem(item);
              }}
            />
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
          )}
        </div>
      </div>

      {deleteModalItem && <CancelListingModal data={deleteModalItem} onClose={() => setDeleteModalItem(null)} />}
    </>
  );
}

// eslint-disable-next-line react/display-name
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
