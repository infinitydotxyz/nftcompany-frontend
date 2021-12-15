import { getAccount } from 'utils/ethersUtil';

export class GameMessenger {
  constructor(iframeWindow: Window, callback: (arg: object) => void) {
    console.log('GameMessenger constructor');

    this.callback = callback;
    window.addEventListener('message', this.listener);

    // tell game we are ready
    this.sendToGame(iframeWindow, 'ready', '');
  }

  public callback: (arg: object) => void;

  dispose = () => {
    console.log('GameMessenger dispose');

    window.removeEventListener('message', this.listener);
  };

  // MessageEventSource ? for sender, didn't work
  sendToGame = (sender: any, message: string, param: string) => {
    console.log('GameMessenger sendToGame');

    sender.postMessage(
      {
        from: 'host',
        message: message,
        param: param
      },
      '*'
    );
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
          const levelImages = [];

          levelImages.push('/path/to/image');
          levelImages.push('/path/to/222');

          this.sendToGame(event.source!, 'level-images', JSON.stringify(levelImages));
          break;

        default:
          console.log(`GM: event not handled ${event.data.toString()}`);
          break;
      }
    }
  };
}
