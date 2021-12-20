import { ethers } from 'ethers';
import { getAccount, getEthersProvider } from 'utils/ethersUtil';
import { apiGet } from './apiUtil';

const doge2048Abi = require('../../pages/game/doge2048/abis/doge2048.json'); // todo: adi
const factoryAbi = require('../../pages/game/doge2048/abis/infinityFactory.json'); // todo: adi
const ierc20Abi = require('../../pages/game/doge2048/abis/ierc20.json');

export class GameMessenger {
  callback: (arg: object) => void;
  chainId: string;
  tokenAddress: string;
  dogTokenAddress: string;
  tokenId: number;
  factoryContract: ethers.Contract;
  ierc20Instance: ethers.Contract;

  constructor(
    iframeWindow: Window,
    chainId: string,
    tokenAddress: string,
    tokenId: number,
    dogTokenAddress: string,
    callback: (arg: object) => void
  ) {
    console.log('GameMessenger constructor');

    this.callback = callback;
    this.chainId = chainId;
    this.tokenAddress = tokenAddress;
    this.tokenId = tokenId;
    this.dogTokenAddress = dogTokenAddress;

    window.addEventListener('message', this.listener);

    this.factoryContract = new ethers.Contract(tokenAddress, factoryAbi, getEthersProvider().getSigner());
    this.ierc20Instance = new ethers.Contract(dogTokenAddress, ierc20Abi, getEthersProvider().getSigner());

    // tell game we are ready
    this.sendToGame(iframeWindow, 'ready', '');
  }

  dispose = () => {
    window.removeEventListener('message', this.listener);
  };

  // MessageEventSource ? for sender, didn't work
  sendToGame = (sender: any, message: string, param: string) => {
    sender.postMessage(
      {
        from: 'host',
        message: message,
        param: param
      },
      '*'
    );
  };

  getLevelImages = async () => {
    const levelImages: string[] = [];
    const levelScores = [0, 44, 125, 317, 765, 1789, 4093, 9213, 20477, 45053, 98301, 212989, 458749, 983037, 2097149];
    for (const score of levelScores) {
      const { result, error } = await apiGet(`/nfts/doge2048/level-images`, {
        chainId: this.chainId,
        tokenAddress: this.tokenAddress,
        score,
        numPlays: score,
        dogBalance: score
      });
      if (!error) {
        const imageUrl = result['image'];
        levelImages.push(imageUrl);
      }
    }
    return levelImages;
  };

  nftImage = async () => {
    // todo: adi change chain name and address and token id
    const { result, error } = await apiGet(`/nfts/polygon/${this.tokenAddress}/${this.tokenId}`);

    if (!error) {
      const imageUrl = result['image'];
      return imageUrl;
    }

    return '';
  };

  listener = async (event: any) => {
    // console.log('listener', event);
    if (event.data && event.data.from === 'game') {
      const instanceAddress = await this.factoryContract.tokenIdToInstance(this.tokenId);
      const nftInstance = new ethers.Contract(instanceAddress, doge2048Abi, getEthersProvider().getSigner());
      switch (event.data.message) {
        case 'game-state':
          const address = await getAccount();
          const numPlays = await nftInstance.numPlays();
          const highScore = await nftInstance.score();
          let dogBalance = await nftInstance.getTokenBalance(this.dogTokenAddress);
          dogBalance = ethers.utils.formatEther(dogBalance);
          this.sendToGame(event.source!, 'game-state', JSON.stringify({ address, highScore, numPlays, dogBalance }));
          break;

        case 'game-results':
          console.log('game result', event.data.param);
          await nftInstance.saveState(
            this.dogTokenAddress,
            event.data.param.score
          );
          break;

        case 'deposit-dog':
          console.log('deposit-dog', event.data.param);
          const amount = ethers.utils.parseEther(event.data.param.amount);
          await this.ierc20Instance.transfer(instanceAddress, amount); // todo: adi
          break;

        case 'level-images':
          const levelImages = await this.getLevelImages();
          this.sendToGame(event.source!, 'level-images', JSON.stringify(levelImages));
          break;

        case 'nft-image':
          const nft = await this.nftImage();
          this.sendToGame(event.source!, 'nft-image', nft);
          break;

        default:
          console.log(`GM: event not handled ${event.data.toString()}`);
          break;
      }
    }
  };
}
