import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Offers.module.scss';

export default function Offers() {
  return (
    <>
      <Head>
        <title>Offers</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title"></div>
          </div>

          <div>
            <section className="grid">
              <div className="col-md-6 col-sm-12">
                <h3 className="tg-title">My Offers</h3>

                <ul style={{ marginTop: 10 }}>
                  <li>Offer 1</li>
                  <li>Offer 2</li>
                </ul>
              </div>

              <div className="col-md-6 col-sm-12">
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
Offers.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
