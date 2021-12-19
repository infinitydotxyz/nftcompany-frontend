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
import { UnmarshalNFTAsset } from 'types/rewardTypes';
import { ethers } from 'ethers';
import { getEthersProvider } from 'utils/ethersUtil';

const doge2048Abi = require('./abis/doge2048.json'); // todo: adi
const factoryAbi = require('./abis/infinityFactory.json'); // todo: adi
const variationName = 'doge2048';
const numToMint = 1;
const dogTokenAddress = '0x3604035F54e5fe0875652842024b49D1Fea11C7C'; // todo: adi
// lower case
const tokenAddress = '0xde945603aa3c9bc22610957dce5646ac6e770e6c'; // todo: adi
const dogTokensPerPlay = 1; // todo: adi
// let gameUrl = 'https://pleasr.infinity.xyz/';
let gameUrl = 'http://localhost:8080/'; // todo: adi

export default function GameFrame() {
  const { user, showAppError, chainId } = useAppContext();
  const [tokenId, setTokenId] = useState<number>(0);
  const [nftAddress, setNftAddress] = useState<string>('');
  const [data, setData] = useState<UnmarshalNFTAsset[]>([]);

  const router = useRouter();
  const {
    query: { url }
  } = router;

  if (url) {
    gameUrl = url as string;
  }

  const fetchData = async () => {
    if (!user || !user?.account) {
      return;
    }

    // todo: adi
    // const contract = new ethers.Contract(
    //   '0x5b94d8F40D4ea284F42edBAdb15291e70332CC9E',
    //   doge2048Abi,
    //   getEthersProvider().getSigner()
    // );
    // const numPlays = await contract.numPlays();
    // const score = await contract.score();
    // let dogBalance = await contract.getTokenBalance(dogTokenAddress);
    // dogBalance = ethers.utils.formatEther(dogBalance);

    const address = user?.account;
    // todo: adi;
    const { result, error } = await apiGet(`/u/${address}/assets`, {
      offset: 0, // not "startAfter" because this is not firebase query.
      limit: ITEMS_PER_PAGE,
      source: 2, // unmarshal
      contract: tokenAddress
    });

    if (error) {
      showAppError(error?.message);
    } else {
      const nfts = result as UnmarshalNFTAsset[];
      if (nfts && nfts.length > 0) {
        // get the last one by default
        const nft = nfts[nfts.length - 1];
        const _tokenId = nft.token_id || '1';
        setTokenId(parseInt(_tokenId));
        if (nft.asset_contract?.toLowerCase() === tokenAddress) {
          // TODO: Adi check for dog balance
          // TODO: Steve if dog balance below minimum then show deposit button
          // best score
          const factoryContract = new ethers.Contract(tokenAddress, factoryAbi, getEthersProvider().getSigner());
          const instanceAddress = await factoryContract.tokenIdToInstance(tokenId);
          console.log('nft instance', instanceAddress);
          setNftAddress(instanceAddress);
          const nftInstance = new ethers.Contract(instanceAddress, doge2048Abi, getEthersProvider().getSigner());
          const numPlays = await nftInstance.numPlays();
          const score = await nftInstance.score();
          let dogBalance = await nftInstance.getTokenBalance(dogTokenAddress);
          dogBalance = ethers.utils.formatEther(dogBalance);
        } else {
          showAppError('Not the right contract ' + nft.asset_contract);
        }
      } else {
        // no doge2048 nfts found
        showAppError('No Doge2048 NFTs');
      }
      // for (const nft of nfts) {
      //   console.log(nft.asset_contract);
      //   const tokenId = nft.token_id || '1';
      //   setTokenId(parseInt(tokenId));
      //   if (nft.asset_contract !== 'wtf') {
      //     // TODO: Adi check for dog balance
      //     // TODO: Steve if dog balance below minimum then show deposit button
      //     // best score
      //     break;
      //   }
      // }
      setData(nfts || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  let contents;

  if (nftAddress && gameUrl) {
    contents = (
      <GameFrameContent
        gameUrl={gameUrl}
        chainId={chainId}
        tokenAddress={tokenAddress}
        tokenId={tokenId}
        dogTokenAddress={dogTokenAddress}
      />
    );
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
              onClick={async () => {
                const factory = new ethers.Contract(tokenAddress, factoryAbi, getEthersProvider().getSigner());
                await factory.mint(variationName, numToMint);
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
  chainId: string;
  tokenAddress: string;
  tokenId: number;
  dogTokenAddress: string;
};

function GameFrameContent({ gameUrl, chainId, tokenAddress, tokenId, dogTokenAddress }: Props) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  React.useEffect(() => {
    let gm: any;
    console.log('game frame', chainId);
    if (chainId && iframeRef && iframeRef.current) {
      const element = iframeRef.current;
      console.log('game frame 155', chainId);
      const iframeWindow = element.contentWindow;

      if (iframeWindow) {
        gm = new GameMessenger(
          iframeWindow,
          chainId,
          tokenAddress,
          tokenId,
          dogTokenAddress,
          (message) => {
            // console.log(message);
          }
        );
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
