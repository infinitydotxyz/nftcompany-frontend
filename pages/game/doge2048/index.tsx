import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styles from './GameFrame.module.scss';
import { GameMessenger } from '../../../src/utils/gameMessenger';
import Layout from 'containers/layout';
import { useAppContext } from 'utils/context/AppContext';
import { Button, Spacer } from '@chakra-ui/react';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { UnmarshalNFTAsset } from 'infinity-types/types/services/unmarshal/Unmarshal';
import { ethers } from 'ethers';
import { Spinner } from '@chakra-ui/spinner';
import { ellipsisString } from 'utils/commonUtil';
import { ProviderManager } from 'utils/providers/ProviderManager';

const ierc20Abi = require('./abis/ierc20.json');

const doge2048Abi = require('./abis/doge2048.json'); // todo: adi
const factoryAbi = require('./abis/infinityFactory.json'); // todo: adi
const variationName = 'doge2048';
const numToMint = 1;
const dogTokenAddress = '0x3604035F54e5fe0875652842024b49D1Fea11C7C'; // todo: adi
// lower case
const tokenAddress = '0xde945603aa3c9bc22610957dce5646ac6e770e6c'; // todo: adi
const dogTokensPerPlay = 1; // todo: adi

// switch for local testing of game
const gameUrl = 'https://pleasr.infinity.xyz/';
// const gameUrl = 'http://localhost:8080/'; // todo: adi

export default function GameFrame() {
  const { user, showAppError, showAppMessage, chainId, providerManager } = useAppContext();
  const [tokenId, setTokenId] = useState<number>(0);
  const [dogBalance, setDogBalance] = useState<number>(-1);
  const [fetching, setFetching] = useState<boolean>(false);
  const [nftAddress, setNftAddress] = useState<string>('');
  const [usersNfts, setUsersNfts] = useState<NFTInfo[]>([]);

  const nftInfoArray = async (nfts: UnmarshalNFTAsset[]): Promise<NFTInfo[]> => {
    const result: NFTInfo[] = [];

    if (nfts.length > 0) {
      for (const item of nfts) {
        const i = new NFTInfo(item);

        if (providerManager) {
          await i.info(providerManager);
        }

        result.push(i);
      }
    }

    return result;
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
      const nfts: UnmarshalNFTAsset[] = result.assets as UnmarshalNFTAsset[];

      if (nfts && nfts.length > 0) {
        const filtered = nfts.filter((e) => {
          return e.asset_contract?.toLowerCase() === tokenAddress;
        });

        if (filtered.length > 0) {
          const infoArray = await nftInfoArray(filtered);

          if (infoArray.length === 1) {
            const n = infoArray[0];

            setTokenId(n.tokenId);
            setNftAddress(n.instanceAddress);
            setDogBalance(n.dogBalance);
          } else if (filtered.length > 1) {
            // more than one, let the user choose
            setUsersNfts(infoArray);
          }
        } else {
          showAppError('Not the right contract');
        }
      } else {
        // no doge2048 nfts found
        showAppError('No Doge2048 NFTs');

        setUsersNfts([]);
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
        <Spinner size="lg" color="teal" ml={4} />
      </div>
    );
  } else if (chainId !== '137') {
    contents = (
      <div className={styles.switchToPolygon}>
        <div className={styles.switchToPolyMessage}>This game runs on the Polygon chain</div>
        <Button
          variant="outline"
          onClick={async () => {
            await providerManager?.request?.({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }]
            } as any);
          }}
        >
          Switch to Polygon
        </Button>
      </div>
    );
  } else if (dogBalance === -1) {
    if (usersNfts.length > 0) {
      const children = usersNfts.map((n, index) => {
        return (
          <Button
            style={{ height: 'auto', marginBottom: 8 }}
            key={n.instanceAddress}
            variant="outline"
            onClick={async () => {
              setTokenId(n.tokenId);
              setNftAddress(n.instanceAddress);
              setDogBalance(n.dogBalance);
            }}
          >
            <div className={styles.chooseNftCard}>
              <div className={styles.chooseNftCardIndex}>{index}.</div>
              <div className={styles.chooseNftCardBody}>
                <div>{ellipsisString(n.instanceAddress)}</div>
                <div>Token Id: {n.tokenId}</div>
                <div>Dog Balance: {n.dogBalance}</div>
                <div>
                  Plays: {n.numPlays}, Score: {n.score}
                </div>
              </div>
            </div>
          </Button>
        );
      });

      contents = (
        <div className={styles.centeredChooseNft}>
          <div className={styles.chooseNft}>
            <div className={styles.title}>Pick an NFT to play the game</div>
            <div className={styles.chooseNftGrid}>{children}</div>
          </div>
        </div>
      );
    }
  } else if (dogBalance < 1) {
    contents = (
      <div className={styles.switchToPolygon}>
        <div className={styles.switchToPolyMessage}>You need at least one Dog token to play this game.</div>
        <Button
          variant="outline"
          onClick={async () => {
            if (providerManager) {
              const ierc20Instance = new ethers.Contract(
                dogTokenAddress,
                ierc20Abi,
                providerManager.getEthersProvider().getSigner()
              );
              const amount = ethers.utils.parseEther('10');
              const factoryContract = new ethers.Contract(
                tokenAddress,
                factoryAbi,
                providerManager.getEthersProvider().getSigner()
              );
              const instanceAddress = await factoryContract.tokenIdToInstance(tokenId);

              ierc20Instance.transfer(instanceAddress, amount); // todo: adi
            } else {
              showAppMessage('Please connect a wallet');
            }
          }}
        >
          Deposit Dog
        </Button>

        {usersNfts.length > 1 && (
          <>
            <div style={{ height: 10 }} />
            <Button
              variant="outline"
              onClick={async () => {
                setDogBalance(-1);
              }}
            >
              Choose Another NFT
            </Button>
          </>
        )}
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
                if (providerManager) {
                  const factory = new ethers.Contract(
                    tokenAddress,
                    factoryAbi,
                    providerManager.getEthersProvider().getSigner()
                  );
                  await factory.mint(variationName, numToMint);

                  showAppMessage('Mint has completed');
                } else {
                  showAppMessage('Please connect a wallet');
                }
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
  const { providerManager } = useAppContext();

  React.useEffect(() => {
    let gm: any;
    if (chainId && iframeRef && iframeRef.current) {
      const element = iframeRef.current;
      const iframeWindow = element.contentWindow;

      if (iframeWindow && providerManager) {
        gm = new GameMessenger(
          providerManager,
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
  }, [iframeRef, chainId, providerManager]);

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
  imageUrl?: string = '';

  info = async (providerManager: ProviderManager) => {
    // only fetch once
    if (!this.instanceAddress) {
      this.tokenId = parseInt(this.nft.token_id || '1');

      const factoryContract = new ethers.Contract(
        tokenAddress,
        factoryAbi,
        providerManager.getEthersProvider().getSigner()
      );
      this.instanceAddress = await factoryContract.tokenIdToInstance(this.tokenId);

      // console.log('token id and instance', this.tokenId, this.instanceAddress);

      const nftInstance = new ethers.Contract(
        this.instanceAddress,
        doge2048Abi,
        providerManager.getEthersProvider().getSigner()
      );
      this.numPlays = await nftInstance.numPlays();
      this.score = await nftInstance.score();
      this.imageUrl = this.nft.issuer_specific_data?.image_url;

      let balance = await nftInstance.getTokenBalance(dogTokenAddress);
      balance = ethers.utils.formatEther(balance);
      this.dogBalance = parseFloat(balance);
    }
  };
}
