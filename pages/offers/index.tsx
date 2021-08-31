import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import pageStyles from '../../styles/Dashboard.module.scss';
import styles from './Offers.module.scss';

export default function Preview() {
  return (
    <>
      <Head>
        <title>Offers</title>
      </Head>
      <div className={pageStyles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">{/* <div className="tg-title">{title}</div> */}</div>

            <div className="center">{/* Center */}</div>

            <div className="left">{/* TBD */}</div>
          </div>

          <div className={styles.main}>
            <section className={styles.info} style={{ display: 'flex' }}>
              <div style={{ width: '100%' }}>
                <h3 className="tg-title">My Offers</h3>

                <ul style={{ marginTop: 10 }}>
                  <li>Offer 1</li>
                  <li>Offer 2</li>
                </ul>
              </div>

              <div style={{ width: '100%' }}>
                <h3 className="tg-title">Offers from Others:</h3>

                <ul style={{ marginTop: 10 }}>
                  <li>Offer 1</li>
                  <li>Offer 2</li>
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
Preview.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
