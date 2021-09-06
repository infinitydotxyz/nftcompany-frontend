import React, { useState } from 'react';
import { NextPage } from 'next';
import { getAccount } from 'utils/ethersUtil';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/spinner';
import CardList from 'components/Card/CardList';
import { API_BASE_MAINNET } from '../../src-os/src/constants';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';

export default function ListNFTs() {
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [user, setUser] = useState<any>(null);

  const fetchData = async () => {
    const account = await getAccount();
    setUser({ account });

    console.log('fetchData');
    await setIsFetching(true);
    let listingData = [];
    try {
      const res = await fetch(`${API_BASE_MAINNET}/u/${account}/listings`);
      const { listings } = (await res.json()) || [];
      listingData = listings;
      console.log('listingData', listingData);
    } catch (e) {
      console.error(e);
    }
    const data = (listingData || []).map((item: any) => {
      const details = item.metadata.asset;
      console.log('details', details);
      return {
        id: item.id,
        title: details.title,
        description: '',
        image: details.image,
        imagePreview: details.imagePreview,
        inStock: 1,
        price: 0.1
      };
    });
    await setIsFetching(false);
    setData(data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);
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
                  // alert('Cancel')
                  await fetch(`${API_BASE_MAINNET}/u/${user.account}/listings/${item.id}`, {
                    method: 'DELETE'
                  });
                  fetchData();
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
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
