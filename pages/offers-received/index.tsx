import React, { useState } from 'react';
import { NextPage } from 'next';
import { useToast } from '@chakra-ui/toast';
import { showMessage } from 'utils/commonUtil';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/spinner';
import CardList from 'components/Card/CardList';
import { apiGet, apiDelete } from 'utils/apiUtil';
import { weiToEther } from '../../src/utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';

import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';

export default function OffersReceived() {
  const { user } = useAppContext();
  const toast = useToast();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const fetchData = async () => {
    if (!user?.account) {
      setData([]);
      return;
    }
    setIsFetching(true);
    let listingData = [];
    try {
      const { result, error } = await apiGet(`/u/${user?.account}/offersreceived`);
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
    setIsFetching(false);
    setData(data);
  };

  React.useEffect(() => {
    console.log('- Offers Received - user:', user);
    fetchData();
  }, [user]);
  return (
    <>
      <Head>
        <title>Offers Received</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="">
              <div className="tg-title">Offers Received</div>
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
                actions={['ACCEPT_OFFER']}
                onClickAction={async (item, action) => {
                  console.log('item, action', item, action);
                  setDeleteModalItem(item);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
OffersReceived.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
