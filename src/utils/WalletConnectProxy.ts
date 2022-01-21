import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

interface SignatureRequest {
  method: 'personal_sign';
  params: string[];
  from: string;
  id: number;
}

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

type Web3Callback<T> = (err: Error | null, result: T) => void;

export class WalletConnectProxy {
  private _provider: WalletConnectProvider;

  public currentProvider: WalletConnectProxy;

  public readonly isWalletConnect = true;

  constructor(provider: WalletConnectProvider) {
    this._provider = provider;
    this.currentProvider = this;
  }

  get connected() {
    return this._provider.connected;
  }

  get accounts() {
    return this._provider.accounts;
  }

  send = (signatureRequest: SignatureRequest, callback: Web3Callback<any>) => {
    console.log(`called send`);
    const message = signatureRequest.params[0];
    console.log(`signing message: ${message}`);
    this._provider.eth
      .sign(message)
      .then((signedMessage: string) => {
        console.log(`Signed: ${signedMessage}`);
        callback(null, signedMessage);
      })
      .catch((err: any) => {
        callback(err, undefined);
      });
  };

  sendAsync = (signatureRequest: SignatureRequest, callback: Web3Callback<any>) => {
    const message = signatureRequest.params[0];
    console.log(`signing message: ${message}`);
    this._provider.eth
      .sign(message)
      .then((signedMessage: string) => {
        console.log(`Signed: ${signedMessage}`);
        callback(null, signedMessage);
      })
      .catch((err: any) => {
        callback(err, undefined);
      });
  };

  async sign(message: string) {
    const sig = await new Promise<any>((resolve, reject) => {
      const callback = (err: Error, res: any) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      };
      this._provider.send(
        {
          method: 'personal_sign',
          params: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)), this.accounts[0]]
        },
        callback
      );
    });

    console.log({ sig });

    const signedMessageHex = sig.result;
    const signature = ethers.utils.splitSignature(signedMessageHex);

    console.log({ signature });

    return signature;
  }
}
