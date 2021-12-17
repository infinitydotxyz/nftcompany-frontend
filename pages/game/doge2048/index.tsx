import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styles from './GameFrame.module.scss';
import { GameMessenger } from '../../../src/utils/gameMessenger';
import Layout from 'containers/layout';
import { PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import { useRouter } from 'next/router';
import { Button, Spacer } from '@chakra-ui/react';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { NFTAsset } from 'types/rewardTypes';
import { ethers } from 'ethers';
import { getEthersProvider } from 'utils/ethersUtil';

const doge2048Abi = require('./abis/doge2048.json'); // todo: adi

export default function GameFrame() {
  const { user, showAppError, chainId } = useAppContext();
  const [nftAddress, setNftAddress] = useState<string>('');
  const [data, setData] = useState<NFTAsset[]>([]);

  const router = useRouter();
  const {
    query: { url }
  } = router;

  const dogTokenAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'; // todo: adi
  const nftFactoryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // todo: adi
  // let gameUrl = 'https://pleasr.infinity.xyz/';
  let gameUrl = 'http://localhost:9092/';
  if (url) {
    gameUrl = url as string;
  }

  const isServer = typeof window === 'undefined';

  const fetchData = async () => {
    if (!user || !user?.account) {
      return;
    }

    const address = user?.account;

    setNftAddress('0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e'); // todo: adi

    // todo: adi
    const contract = new ethers.Contract(
      '0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e',
      doge2048Abi,
      getEthersProvider().getSigner()
    );
    const numPlays = await contract.numPlays();
    const score = await contract.score();
    const dogBalance = (await contract.getTokenBalance(dogTokenAddress)).toNumber();
    console.log(numPlays, score, dogBalance);

    // const address = '0xC844c8e1207B9d3C54878C849A431301bA9c23E0';
    // todo: adi
    // const { result, error } = await apiGet(`/u/${address}/assets`, {
    //   offset: 0, // not "startAfter" because this is not firebase query.
    //   limit: ITEMS_PER_PAGE,
    //   source: 2,
    //   contract: nftFactoryAddress
    // });

    // if (error) {
    //   showAppError(error?.message);
    // } else {
    //   const nfts = result as NFTAsset[];

    //   for (const nft of nfts) {
    //     console.log(nft.asset_contract);

    //     // if doge nft
    //     // TODO: Steve if find token for NFT
    //     if (nft.asset_contract !== 'wtf') {
    //       // TODO: Adi check for dog balance
    //       // TODO: Steve if dog balance below minimum then show deposit button
    //       // best score
    //       setNftAddress(nft.asset_contract!);
    //       break;
    //     }
    //   }

    //   setData(nfts || []);
    // }
  };;

  useEffect(() => {
    fetchData();
  }, [user]);

  let contents;

  if (nftAddress && gameUrl) {
    contents = <GameFrameContent gameUrl={gameUrl} chainId={chainId} nftAddress={nftAddress} />;
  } else {
    contents = <div>You need to mint an NFT to play the game</div>;
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

            <Spacer />

            <Button
              variant="outline"
              onClick={() => {
                console.log('mint doge here');
              }}
            >
              Mint Doge 2048 NFT
            </Button>
          </div>

          <div>
            <PleaseConnectWallet account={user?.account} />

            {contents}
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
GameFrame.getLayout = (page: NextPage) => <Layout>{page}</Layout>;

// =================================================================

type Props = {
  gameUrl: string;
  nftAddress: string;
  chainId: string;
};

function GameFrameContent({ gameUrl, chainId, nftAddress }: Props) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  React.useEffect(() => {
    let gm: any;

    if (chainId && iframeRef && iframeRef.current) {
      const element = iframeRef.current;

      const iframeWindow = element.contentWindow;

      if (iframeWindow) {
        gm = new GameMessenger(iframeWindow, chainId, (message) => {
          // console.log(message);
        });
      }
    }

    return () => {
      gm?.dispose();
    };
  }, [iframeRef, chainId]);

  return (
    <div className={styles.gameFrame}>
      <iframe ref={iframeRef} src={gameUrl} height="900px" width="100%" />
    </div>
  );
}
