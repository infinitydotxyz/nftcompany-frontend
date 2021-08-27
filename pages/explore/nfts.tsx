import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from '../../styles/Dashboard.module.scss';
import NFT from 'components/nft/nft';
import CardList from 'components/Card/CardList';
import { sampleData } from '../../src/utils/apiUtil';
import { Select } from '@chakra-ui/react';

export default function Nfts() {
  return (
    <>
      <Head>
        <title>Explore NFTs</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="full">
              <div
                className="tg-title"
                style={{
                  position: 'absolute',
                  backgroundColor: '#fff',
                  marginTop: -20,
                  paddingTop: 20,
                  width: 180,
                  height: 70,
                  fontSize: 24
                }}
              >
                Explore NFTs
                {/* <div style={{ position: 'absolute', backgroundColor: '#fff', width: 180, height: 70 }}>&nbsp;</div> */}
              </div>
            </div>

            <div className="left">{/* Filter */}</div>
          </div>

          <iframe
            src="https://opensea.io/assets"
            width="100%"
            style={{ marginTop: -20, height: 'calc(100vh - 150px)' }}
          />
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Nfts.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
