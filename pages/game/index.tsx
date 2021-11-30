import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styles from './GameFrame.module.scss';
import Layout from 'containers/layout';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import { useRouter } from 'next/router';

export default function GameFrame() {
  const { user } = useAppContext();
  const router = useRouter();
  const {
    query: { url }
  } = router;

  let gameUrl = 'https://pleasr.infinity.xyz/';
  if (url) {
    gameUrl = url as string;
  }

  return (
    <>
      <Head>
        <title>Doge 2048</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Doge 2048</div>
          </div>

          <div className={styles.gameFrame}>
            <PleaseConnectWallet account={user?.account} />

            <iframe src={gameUrl} height="900px" width="100%" />
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
GameFrame.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
