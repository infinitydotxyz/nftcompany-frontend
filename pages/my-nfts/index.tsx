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

import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';
import { CardData } from 'components/Card/Card';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';

const transformOpenSea = (item: any) => {
  if (!item) {
    return null;
  }

  return {
    id: `${item?.asset_contract?.address}_${item?.token_id}`,
    title: item.name,
    description: item.description,
    image: item.image_url,
    imagePreview: item.image_preview_url,
    tokenAddress: item.asset_contract.address,
    tokenId: item.token_id,
    collectionName: item.asset_contract.name,
    inStock: 1,
    price: 0.1
  } as CardData;
};

export default function MyNFTs() {
  const { user, showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
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
      offset: newCurrentPage * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
      source: 1
    });
    if (error) {
      showAppError(`${error.message}`);
      return;
    }
    const moreData = (result?.assets || []).map((item: any) => {
      const newItem = transformOpenSea(item);
      return newItem;
    });
    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    console.log('- My NFTs - user:', user);
    fetchData();
  }, [user]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    console.log('currentPage loaded:', currentPage);
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>My NFTs</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="">
              <div className="tg-title">My NFTs</div>
            </div>

            <div className="center">&nbsp;</div>

            <div className="left">{/* TBD */}</div>
          </div>

          <div className={styles.main}>
            <NoData isFetching={isFetching} data={data} currentPage={currentPage} />
            {data?.length === 0 && isFetching && <LoadingCardList />}
            
            <CardList
              data={data}
              showItems={[]}
              actions={['LIST_NFT']}
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
            onFetchMore={async () => {
              console.log('onFetchMore()');
              await setDataLoaded(false);
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
