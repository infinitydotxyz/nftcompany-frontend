import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { useToast } from '@chakra-ui/toast';
import { showMessage } from 'utils/commonUtil';
import { Spinner } from '@chakra-ui/spinner';
import CardList from 'components/Card/CardList';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';
import { apiGet } from 'utils/apiUtil';
import { getAccount } from 'utils/ethersUtil';

// transform unmarshall data
const getAssetList = (data: any[]) =>
  data.map((item) => {
    try {
      // const details = JSON.parse(item.issuer_specific_data.entire_response).result.data;
      // const obj = {
      //   id: item.token_id,
      //   title: details.name,
      //   description: details.description,
      //   price: 0.1,
      //   inStock: 1,
      //   image: details['small_image'],
      //   data: { ...item, details }
      // };
      const details = JSON.parse(item?.issuer_specific_data?.entire_response);
      const obj = {
        id: item.token_id,
        title: details.name,
        description: details.description,
        price: 0.1,
        inStock: 1,
        image: details.image,
        imagePreview: details.image,
        data: { ...item, details }
      };
      return obj;
    } catch (e) {
      console.error(e);
      return {
        id: item.token_id,
        title: `ID: ${item.token_id}`,
        image: 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png',
        imagePreview: 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png',
        data: { ...item }
      };
    }
  });

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
  };
};

export default function MyNFTs() {
  const toast = useToast();
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [listModalItem, setListModalItem] = useState(null);

  const [user, setUser] = useState<any>(null);
  React.useEffect(() => {
    const connect = async () => {
      const account = await getAccount();
      setUser({ account });

      const fetchData = async () => {
        await setIsFetching(true);
        const { result, error } = await apiGet(`/u/${account}/assets`, {
          offset: 0,
          limit: 50,
          source: 1
        });
        if (error) {
          showMessage(toast, 'error', `${error.message}`);
          return;
        }
        const data = (result?.assets || []).map((item: any) => {
          const newItem = transformOpenSea(item);
          return newItem;
        });
        await setIsFetching(false);
        setData(data);
      };
      fetchData();
    };
    connect();
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
              <div className="tg-title">My NFTs</div>
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
                showItems={[]}
                actions={['LIST_NFT']}
                onClickAction={(item, action) => {
                  // console.log('item, action', item, action);
                  setListModalItem(item);
                }}
              />
            )}
          </div>
        </div>

        {listModalItem && <ListNFTModal data={listModalItem} onClose={() => setListModalItem(null)} />}
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
MyNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
