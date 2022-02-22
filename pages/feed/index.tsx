import React from 'react';
import { NextPage } from 'next';
import Layout from 'containers/layout';
import Head from 'next/head';
import styles from './Feed.module.scss';

const ActivityFeed = () => {
  return (
    <>
      <Head>
        <title>Activity Feed</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Activity Feed</div>
            <div className={styles.row}>
              <p>TODO: filters here</p>
            </div>
          </div>
          <p>TODO: content here</p>
        </div>
      </div>
    </>
  );
};

ActivityFeed.getLayout = (page: NextPage) => <Layout>{page}</Layout>;

export default ActivityFeed;
