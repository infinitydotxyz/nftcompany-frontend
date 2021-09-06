import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/spinner';
import CardList from 'components/Card/CardList';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import { sampleData, dummyFetch } from 'utils/apiUtil';
import { web3GetSeaport } from 'utils/ethersUtil';
import { API_BASE_MAINNET } from '../../src-os/src/constants'
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';
import assetsData from './mock-os-assets.json';
import apiData from './mock-cov-data.json';
import unmarshalData from './mock-um-assets.json';
import { getAccount } from 'utils/ethersUtil';

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

export default function MyNFTs() {
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
        // const tokenAddress = account.toLowerCase(); // '0xa7e1551ced00a5e3036c227c3e8ded7ebb688e6a'; // account;
        const res = await fetch(`${API_BASE_MAINNET}/u/${account}/assets?offset=0&limit=50&source=1&ts=${Date.now()}`);
        const resJson = (await res.json()) || [];
        console.log('fetchData data:', resJson);

        // const assetList = getAssetList(data);
        // console.log('assetList', data, assetList);

        // TODO:
        // const transformOpenSeaRes = () => { 
        // }
        // const transformUnmarshallRes = () => { 
        // }

        const data = (resJson?.assets || []).map((item: any) => {
          return {
            id: `${item.asset_contract.address}_${item.token_id}`,
            name: item.name,
            description: item.description,
            image: item.image_url,
            imagePreview: item.image_preview_url,
            tokenAddress: item.asset_contract.address,
            tokenId: item.token_id,
            inStock: 1,
            price: 0.1
          };
        });
        await setIsFetching(false);
        setData(data);

        // await setIsFetching(false);
        // setData(getAssetList(data));
      };
      fetchData();

      // const web3GetListedNFTs = async () => {
      //   console.log('web3GetListedNFTs', account);
      //   try {
      //     const seaport = web3GetSeaport();
      //     const res = await seaport.api.getAssets({
      //       owner: account // '0x495f947276749ce646f68ac8c248420045cb7b5e'
      //     });
      //     console.log('res', res);

      //     // TODO: remove mock data
      //     const data = (res?.assets || []).map((item: any) => {
      //       return {
      //         id: item.tokenId,
      //         name: item.name,
      //         description: item.description,
      //         image: item.imageUrl,
      //         imagePreview: item.imagePreviewUrl,
      //         inStock: 1,
      //         price: 0.1
      //       };
      //     });
      //     setData(data);
      //   } catch (e) {
      //     console.error(e);
      //   }
      // };
      // web3GetListedNFTs();
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
