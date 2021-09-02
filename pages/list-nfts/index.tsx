import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from './ListNFTs.module.scss';

export default function ListNFTs() {
  return (
    <>
      <Head>
        <title>List NFTs</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">{/* <div className="tg-title">{title}</div> */}</div>

            <div className="center">{/* Center */}</div>

            <div className="left">{/* TBD */}</div>
          </div>

          <div className={styles.main}>
            <section className="container container-fluid grid">
              <div className="col-md-6 col-sm-12">
                <h3 className="tg-title">Owned NFTs</h3>

                <ul style={{ marginTop: 10 }}>
                  <li>NFT 1</li>
                  <li>NFT 2</li>
                </ul>
              </div>

              <div className="col-md-6 col-sm-12">
                <h3 className="tg-title">Listed NFTs:</h3>

                <ul style={{ marginTop: 10 }}>
                  <li>NFT 1</li>
                  <li>NFT 2</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
