import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from '../../styles/Dashboard.module.scss';
import NFT from 'components/nft/nft';
import CardList from 'components/Card/CardList';
import { sampleData } from '../../src/utils/apiUtil';
import { Select } from '@chakra-ui/react';

export default function MyItems() {
  return (
    <>
      <Head>
        <title>My Items</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">
              <div className="tg-title">My Items</div>
            </div>

            <div className="left">{/* Filter */}</div>
          </div>

          <CardList data={sampleData} viewInfo={true} />
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
MyItems.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
