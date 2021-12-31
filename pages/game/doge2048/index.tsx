import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styles from './GameFrame.module.scss';
import { GameMessenger } from '../../../src/utils/gameMessenger';
import Layout from 'containers/layout';
import { useAppContext } from 'utils/context/AppContext';
import { useRouter } from 'next/router';
import { Button, Spacer } from '@chakra-ui/react';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { UnmarshalNFTAsset } from 'types/rewardTypes';
import { ethers } from 'ethers';
import { getEthersProvider } from 'utils/ethersUtil';
import { Spinner } from '@chakra-ui/spinner';

const ierc20Abi = require('./abis/ierc20.json');

const doge2048Abi = require('./abis/doge2048.json'); // todo: adi
const factoryAbi = require('./abis/infinityFactory.json'); // todo: adi
const variationName = 'doge2048';
const numToMint = 1;
const dogTokenAddress = '0x3604035F54e5fe0875652842024b49D1Fea11C7C'; // todo: adi
// lower case
const tokenAddress = '0xde945603aa3c9bc22610957dce5646ac6e770e6c'; // todo: adi
const dogTokensPerPlay = 1; // todo: adi
let gameUrl = 'https://pleasr.infinity.xyz/';
// let gameUrl = 'http://localhost:8080/'; // todo: adi

export default function GameFrame() {
  const { user, showAppError, showAppMessage, chainId } = useAppContext();
  const [tokenId, setTokenId] = useState<number>(0);
  const [dogBalance, setDogBalance] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);
  const [nftAddress, setNftAddress] = useState<string>('');
  const [data, setData] = useState<UnmarshalNFTAsset[]>([]);

  const router = useRouter();
  const {
    query: { url }
  } = router;

  if (url) {
    gameUrl = url as string;
  }

  const findBestNft = async (nfts: UnmarshalNFTAsset[]): Promise<NFTInfo | undefined> => {
    const filtered = nfts.filter((e) => {
      return e.asset_contract?.toLowerCase() === tokenAddress;
    });

    if (filtered.length > 0) {
      let best: NFTInfo | undefined;

      for (const item of filtered) {
        const i = new NFTInfo(item);

        await i.info();

        if (!best) {
          best = i;
        } else {
          if (i.dogBalance > best.dogBalance) {
            best = i;
          }
        }
      }

      return best;
    }
  };

  const fetchData = async () => {
    if (!user || !user?.account) {
      return;
    }

    // Polygon only
    if (chainId !== '137') {
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
    setFetching(true);

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
      const nfts = result.assets as UnmarshalNFTAsset[];
      if (nfts && nfts.length > 0) {
        const nftInfo = await findBestNft(nfts);

        if (nftInfo) {
          setTokenId(nftInfo.tokenId);
          setNftAddress(nftInfo.instanceAddress);
          setDogBalance(nftInfo.dogBalance);
        } else {
          showAppError('Not the right contract');
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

    setFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, [user, chainId]);

  let contents;

  if (!user?.account) {
    contents = (
      <div className={styles.switchToPolygon}>
        <div className={styles.switchToPolyMessage}>Please connect to your MetaMask wallet</div>
      </div>
    );
  } else if (fetching) {
    contents = (
      <div className={styles.switchToPolygon}>
        <Spinner size="lg" color="teal" ml={4} />;
      </div>
    );
  } else if (chainId !== '137') {
    contents = (
      <div className={styles.switchToPolygon}>
        <div className={styles.switchToPolyMessage}>This game runs on the Polygon chain</div>
        <Button
          variant="outline"
          onClick={async () => {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }]
            });
          }}
        >
          Switch to Polygon
        </Button>
      </div>
    );
  } else if (dogBalance < 1) {
    contents = (
      <div className={styles.switchToPolygon}>
        <div className={styles.switchToPolyMessage}>You need at least one Dog token to play this game.</div>
        <Button
          variant="outline"
          onClick={async () => {
            const ierc20Instance = new ethers.Contract(dogTokenAddress, ierc20Abi, getEthersProvider().getSigner());

            const amount = ethers.utils.parseEther('10');
            const factoryContract = new ethers.Contract(tokenAddress, factoryAbi, getEthersProvider().getSigner());
            const instanceAddress = await factoryContract.tokenIdToInstance(tokenId);

            ierc20Instance.transfer(instanceAddress, amount); // todo: adi
          }}
        >
          Deposit Dog
        </Button>
      </div>
    );
  } else {
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

                showAppMessage('Mint has completed');
              }}
            >
              Mint Doge 2048 NFT
            </Button>
          </div>

          <div>{contents}</div>
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
    if (chainId && iframeRef && iframeRef.current) {
      const element = iframeRef.current;
      const iframeWindow = element.contentWindow;

      if (iframeWindow) {
        gm = new GameMessenger(iframeWindow, chainId, tokenAddress, tokenId, dogTokenAddress, (message) => {
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

// ====================================================
// ====================================================

class NFTInfo {
  constructor(nft: UnmarshalNFTAsset) {
    this.nft = nft;
  }

  nft: UnmarshalNFTAsset;
  tokenId: number = 1;
  instanceAddress: string = '';
  dogBalance: number = 0;
  numPlays: number = 0;
  score: number = 0;

  info = async () => {
    // only fetch once
    if (!this.instanceAddress) {
      this.tokenId = parseInt(this.nft.token_id || '1');

      const factoryContract = new ethers.Contract(tokenAddress, factoryAbi, getEthersProvider().getSigner());
      this.instanceAddress = await factoryContract.tokenIdToInstance(this.tokenId);

      // console.log('token id and instance', this.tokenId, this.instanceAddress);

      const nftInstance = new ethers.Contract(this.instanceAddress, doge2048Abi, getEthersProvider().getSigner());
      this.numPlays = await nftInstance.numPlays();
      this.score = await nftInstance.score();

      let balance = await nftInstance.getTokenBalance(dogTokenAddress);
      balance = ethers.utils.formatEther(balance);
      this.dogBalance = parseFloat(balance);
    }
  };
}
