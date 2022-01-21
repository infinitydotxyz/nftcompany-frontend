import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, Signature } from 'ethers';
import { PROVIDER_URL_MAINNET, PROVIDER_URL_POLYGON } from 'utils/constants';
import { AbstractProvider, ProviderEvents, WalletType } from './AbstractProvider';
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
    this.registerListeners();
    try {
      const accounts = await this._provider.enable();
      this.account = accounts[0];
    } catch (err: Error | any) {
      if (err.message === 'Failed or Rejected Request') {
        throw new UserRejectException(this.type);
      }
      throw err;
    }
  }

  async getAccounts() {
    return await this._provider.request({ method: 'eth_accounts' });
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
      throw err;
    }
  }

  disconnect(): void {
    /**
     * throws an error when disconnecting
     * it seems like it can safely be ignored
     */
    this._provider?.close?.().catch(() => {
      return;
    });
  }

  registerListeners(): void {
    this._provider.on('accountsChanged', (accounts: string[]) => {
      this.account = accounts[0];
    });
    this._provider.on('chainChanged', (chainId: number) => {
      this.chainId = `${chainId}`;
    });

    this._provider.on('disconnect', (code: number, reason: string) => {
      this.isConnected = false;
    });

    this._provider.onConnect(() => {
      this.isConnected = true;
    });
  }
}
