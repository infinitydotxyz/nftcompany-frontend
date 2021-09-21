import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import { apiGet } from 'utils/apiUtil';
import DeleteListingModal from './DeleteListingModal';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, getLastItemCreatedAt, NoData } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import { ordersToCardData } from 'services/Listings.service';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { CardData } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { apiPost } from 'utils/apiUtil';
import { GenericError } from 'types';

export default function ListNFTs() {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [deleteModalItem, setDeleteModalItem] = useState<CardData | null>(null);

  const cancelListing = async (item: CardData) => {
    try {
      const seaport = getOpenSeaport();
      const order = seaport.api.getOrder({
        maker: user!.account,
        id: item?.id,
        side: 1 // sell order
      });

      if (order) {
        const txnHash = await seaport.cancelOrder({
          order: order,
          accountAddress: user?.account
        });
        console.log('Cancel listing txn hash: ' + txnHash);
        const payload = {
          actionType: 'cancel',
          txnHash,
          side: 1,
          orderId: item?.id
        };
        const { result, error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns`, {}, payload);
        if (error) {
          showAppError((error as GenericError)?.message);
        }
      } else {
        // Handle when the order does not exist anymore
        showAppError('Listing not found to cancel. Refresh page.');
      }
    } catch (err) {
      showAppError((err as GenericError)?.message);
    }
  };

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
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="">
              <div className="tg-title">Listed NFTs</div>
            </div>

            <div className="center">&nbsp;</div>

            <div className="left">{/* TBD */}</div>
          </div>

          <div className={styles.main}>
            <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={data} />
            {data?.length === 0 && isFetching && <LoadingCardList />}

            <CardList
              data={data}
              actions={['CANCEL_LISTING']}
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

      {deleteModalItem && (
        <DeleteListingModal
          user={user}
          data={deleteModalItem}
          onClose={() => setDeleteModalItem(null)}
          onSubmit={async () => {
            cancelListing({ ...deleteModalItem });
            setDeleteModalItem(null);
          }}
        />
      )}
    </>
  );
}

// eslint-disable-next-line react/display-name
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
