import { getAccount } from 'utils/ethersUtil';
import { apiGet } from './apiUtil';

export class GameMessenger {
  constructor(iframeWindow: Window, chainId: string, callback: (arg: object) => void) {
    console.log('GameMessenger constructor');

    this.callback = callback;
    this.chainId = chainId;

    window.addEventListener('message', this.listener);

    // tell game we are ready
    this.sendToGame(iframeWindow, 'ready', '');
  }

  callback: (arg: object) => void;
  chainId: string;

  dispose = () => {
    console.log('GameMessenger dispose');

    window.removeEventListener('message', this.listener);
  };

  // MessageEventSource ? for sender, didn't work
  sendToGame = (sender: any, message: string, param: string) => {
    console.log(`GameMessenger sendToGame ${param} ${message}`);

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

    // '0xC844c8e1207B9d3C54878C849A431301bA9c23E0'

    // const address = user?.account;
    const address = '0xC844c8e1207B9d3C54878C849A431301bA9c23E0';

    const levelScores = [0, 44, 125, 317, 765, 1789, 4093, 9213, 20477, 45053, 98301, 212989, 458749, 983037, 2097149];

    for (const score of levelScores) {
      const { result, error } = await apiGet(
        `/nfts/0xC844c8e1207B9d3C54878C849A431301bA9c23E0/4c8e1207B9d3C54878C849A431301bA9c23E0`,
        {
          chainId: this.chainId,
          score,
          numPlays: score | 0
        }
      );

      if (!error) {
        const nftUrl = result['nftUrl'];
        levelImages.push(nftUrl);
      }
    }

    return levelImages;
  };

  nftImage = async () => {
    const levelImages: string[] = [];

    // '0xC844c8e1207B9d3C54878C849A431301bA9c23E0'

    // const address = user?.account;
    const address = '0xC844c8e1207B9d3C54878C849A431301bA9c23E0';

    const { result, error } = await apiGet(
      `/nfts/0xC844c8e1207B9d3C54878C849A431301bA9c23E0/4c8e1207B9d3C54878C849A431301bA9c23E0`,
      {
        chainId: this.chainId,
        score: 3000,
        numPlays: 33
      }
    );

    if (!error) {
      const nftUrl = result['nftUrl'];
      return nftUrl;
    }

    return '';
  };

  listener = async (event: any) => {
    if (event.data && event.data.from === 'game') {
      console.log(event);
      switch (event.data.message) {
        case 'address':
          const address = await getAccount();

          this.sendToGame(event.source!, 'address', address);
          break;

        case 'game-results':
          console.log(event.data.param);
          break;

        case 'deposit-dog':
          console.log('deposit-dog');
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
