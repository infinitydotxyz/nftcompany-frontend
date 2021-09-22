import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, NoData } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import styles from '../../styles/Dashboard.module.scss';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { transformOpenSea } from 'utils/commonUtil';
import { CardData } from 'types/Nft.interface';

export default function MyNFTs() {
  const { user, showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [listModalItem, setListModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async () => {
    if (!user || !user?.account) {
      setData([]);
      return;
    }
    setIsFetching(true);
    const newCurrentPage = currentPage + 1;

    const { result, error } = await apiGet(`/u/${user?.account}/assets`, {
      offset: newCurrentPage * ITEMS_PER_PAGE, // not "startAfter" because this is not firebase query.
      limit: ITEMS_PER_PAGE,
      source: 1
    });
    if (error) {
      showAppError(`${error.message}`);
      return;
    }
    const moreData = (result?.assets || []).map((item: any) => {
      const newItem = transformOpenSea(item, user?.account);
      return newItem;
    });
    setIsFetching(false);
    setData([...data, ...moreData]);
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
        <title>My NFTs</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">My NFTs</div>
          </div>

          <div className={styles.main}>
            <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={data} />
            {data?.length === 0 && isFetching && <LoadingCardList />}

            <CardList
              data={data}
              showItems={[]}
              action="LIST_NFT"
              onClickAction={(item, action) => {
                // console.log('item, action', item, action);
                setListModalItem(item);
              }}
            />
          </div>
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

        {listModalItem && <ListNFTModal data={listModalItem} onClose={() => setListModalItem(null)} />}
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
MyNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
