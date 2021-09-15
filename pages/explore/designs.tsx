import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from '../../styles/Dashboard.module.scss';
import NFT from 'components/nft/nft';

export default function Designs() {
  return (
    <>
      <Head>
        <title>Designs</title>
      </Head>
      <div className={styles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">
              <div className="tg-title">My Items</div>
            </div>

            <div className="left">
              {/* <Select
                placeholder="Filter..."
                fontWeight={500}
                lineHeight={'40px'}
                borderRadius={40}
                colorScheme="blackAlpha"
              >
                <option value="option1">New items</option>
                <option value="option2">Great Items</option>
              </Select> */}
            </div>
          </div>

          <div className={styles.nftsGrid}>
            <NFT title="AAVE" address="0xc812...AeFg" id="2456123" brandColor="#24DB83" bgColor="#E6FBF0" />
            <NFT title="AAVE" address="0xc812...AeFg" id="2456123" brandColor="#24DB83" bgColor="#E6FBF0" />
            <NFT title="AAVE" address="0xc812...AeFg" id="2456123" brandColor="#24DB83" bgColor="#E6FBF0" />
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Designs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
