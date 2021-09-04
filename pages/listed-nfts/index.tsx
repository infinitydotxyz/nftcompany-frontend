import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/spinner';
import CardList from 'components/Card/CardList';
import { sampleData, dummyFetch } from 'utils/apiUtil';
import { web3GetSeaport } from 'utils/ethersUtil';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from '../../styles/Dashboard.module.scss';
import assetsData from './mock-os-assets.json';
import apiData from './mock-cov-data.json';
import unmarshalData from './mock-um-assets.json';

export default function ListNFTs() {
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);

  React.useEffect(() => {
    const web3GetListedNFTs = async () => {
      console.log('web3GetListedNFTs');
      await setIsFetching(true);
      try {
        const seaport = web3GetSeaport();
        // const res = await seaport.api.getAssets({
        //   asset_contract_address: '0x495f947276749ce646f68ac8c248420045cb7b5e'
        // });
        const res = await seaport.api.getOrders({
          asset_contract_address: '0x495f947276749ce646f68ac8c248420045cb7b5e',
          side: 1
        });
        console.log('- getOrders res:', res);
      } catch (e) {
        console.error(e);
      }
      // TODO: remove mock data
      const data = (assetsData?.assets || []).map((item: any) => {
        return {
          name: item.name,
          description: item.description,
          image: item.image_preview_url,
          inStock: 1,
          price: 0.1
        };
      });
      await setIsFetching(false);
      setData(data);
    };
    web3GetListedNFTs();
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
            {isFetching ? <Spinner size="md" color="gray.800" /> : <CardList data={data} />}
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
