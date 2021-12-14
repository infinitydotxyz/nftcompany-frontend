import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styles from './GameFrame.module.scss';
import { GameMessenger } from '../../../src/utils/gameMessenger';
import Layout from 'containers/layout';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import { useRouter } from 'next/router';
import { Button, Spacer } from '@chakra-ui/react';

export default function GameFrame() {
  const { user } = useAppContext();
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  const router = useRouter();
  const {
    query: { url }
  } = router;

  let gameUrl = 'https://pleasr.infinity.xyz/';
  // let gameUrl = 'http://localhost:9092/';
  if (url) {
    gameUrl = url as string;
  }

  const isServer = typeof window === 'undefined';

  React.useEffect(() => {
    let gm: any;

    if (!isServer) {
      if (iframeRef && iframeRef.current) {
        const element = iframeRef.current;

        const iframeWindow = element.contentWindow;

        if (iframeWindow) {
          gm = new GameMessenger(iframeWindow, (message) => {
            // console.log(message);
          });
        }
      }
    }

    return () => {
      gm?.dispose();
    };
  }, [iframeRef]);

  return (
    <>
      <Head>
        <title>Doge 2048</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Doge 2048</div>

            <Spacer />

            <Button
              variant="outline"
              onClick={() => {
                // sdf
              }}
            >
              Mint Doge 2048 NFT
            </Button>
          </div>

          <div className={styles.gameFrame}>
            <PleaseConnectWallet account={user?.account} />

            <iframe ref={iframeRef} src={gameUrl} height="900px" width="100%" />
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
GameFrame.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
