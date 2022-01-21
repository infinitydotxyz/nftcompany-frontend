import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, Signature } from 'ethers';
import { PROVIDER_URL_MAINNET, PROVIDER_URL_POLYGON } from 'utils/constants';
import { Web3Method } from 'walletlink/dist/relay/Web3Method';
import { AbstractProvider, WalletType } from './AbstractProvider';
import { UserRejectException } from './UserRejectException';
const Web3 = require('web3');
export class WalletConnect extends AbstractProvider {
  private _provider: WalletConnectProvider;

  public readonly type = WalletType.WalletConnect;

  constructor() {
    super();
    this._provider = new WalletConnectProvider({
      rpc: {
        1: PROVIDER_URL_MAINNET,
        137: PROVIDER_URL_POLYGON
      }
    });
  }

  get web3Provider(): any {
    return new Web3(this._provider);
  }

  async init() {
    try {
      const accounts = await this._provider.enable();
      this.account = accounts[0];
    } catch (err: Error | any) {
      if (err.message === 'Failed or Rejected Request') {
        throw new UserRejectException(this.type);
      }
      console.error(err);
      throw err;
    }
  }

  async personalSign(message: string): Promise<Signature> {
    try {
      const hexMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));
      const params = [hexMessage];
      if (this.account) {
        params.push(this.account);
      }

      const signedMessageHex = await new Promise<string>((resolve, reject) => {
        const cb = (err: Error, res: { result: string }) => {
          if (err) {
            reject(err);
          }
          resolve(res.result);
        };
        this._provider.send(
          {
            method: 'personal_sign',
            params
          },
          cb
        );
      });

      const signature = ethers.utils.splitSignature(signedMessageHex);
      return signature;
    } catch (err: Error | any) {
      if (err.message === 'Failed or Rejected Request') {
        throw new UserRejectException(this.type);
      }
      console.error(err);
      throw err;
    }
  }
}
