import React, { useState } from 'react';
import { NextPage } from 'next';
import { getAccount } from 'utils/ethersUtil';
import { useToast } from '@chakra-ui/toast';
import { showMessage } from 'utils/commonUtil';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/spinner';
import CardList from 'components/Card/CardList';
import { apiGet, apiDelete } from 'utils/apiUtil';
import { weiToEther } from '../../src/utils/ethersUtil';
import DeleteListingModal from './DeleteListingModal';
import { useAppContext } from 'utils/context/AppContext';

import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';

export default function ListNFTs() {
  const { user } = useAppContext();
  const toast = useToast();
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const fetchData = async () => {
    if (!user?.account) {
      setData([])
      return
    }
    await setIsFetching(true);
    let listingData = [];
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/listings`);
      if (error) {
        showMessage(toast, 'error', `${error}`);
        return;
      }
      listingData = result?.listings || [];
      console.log('listingData', listingData);
    } catch (e) {
      console.error(e);
    }
    const data = (listingData || []).map((item: any) => {
      const details = item.metadata.asset;
      // console.log('details', details);
      return {
        id: item.id,
        title: details.title,
        description: '',
        image: details.image,
        imagePreview: details.imagePreview,
        tokenAddress: details.address,
        tokenId: details.id,
        inStock: 1,
        price: weiToEther(item.basePrice),
        maker: item.maker,
        metadata: item.metadata
      };
    });
    console.log('data', data);
    await setIsFetching(false);
    setData(data);
  };

  React.useEffect(() => {
    console.log('- Listed NFTs - user:', user)
    fetchData();
  }, [user]);
  return (
    <>
      <Head>
        <title>List NFTs</title>
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
            {isFetching ? (
              <Spinner size="md" color="gray.800" />
            ) : (
              <CardList
                data={data}
                actions={['CANCEL_LISTING']}
                onClickAction={async (item, action) => {
                  console.log('item, action', item, action);
                  setDeleteModalItem(item);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {deleteModalItem && (
        <DeleteListingModal
          user={user}
          data={deleteModalItem}
          onClose={() => setDeleteModalItem(null)}
          onSubmit={() => {
            setDeleteModalItem(null);
            fetchData();
            showMessage(toast, 'info', `Listing deleted successfully.`);
          }}
        />
      )}
    </>
  );
}

// eslint-disable-next-line react/display-name
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
