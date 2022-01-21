import { ethers, Signature } from 'ethers';
import { AbstractProvider, WalletType } from './AbstractProvider';
const Web3 = require('web3');

export class MetaMask extends AbstractProvider {
  private _provider: any;

  public readonly type = WalletType.MetaMask;

  constructor() {
    super();

    if (window.ethereum?.isMetaMask) {
      this._provider = window.ethereum;
    } else {
      const metamaskProvider = ((window.ethereum as any)?.providers || []).find((item: any) => item?.isMetaMask);
      if (metamaskProvider) {
        this._provider = metamaskProvider;
      } else {
        throw new Error('MetaMask is not installed');
      }
    }
  }

  get web3Provider(): any {
    return new Web3(this._provider);
  }

  async init() {
    try {
      const accounts = await this._provider.request({ method: 'eth_accounts' });

      this.account = accounts[0];
    } catch (err: Error | any) {
      if (err?.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    }
  }

  async personalSign(message: string): Promise<Signature> {
    const params = [message];
    if (this.account) {
      params.push(this.account);
    }
    try {
      const response: string = await this.web3Provider.currentProvider.request({
        method: 'personal_sign',
        params
      });
      const signature = ethers.utils.splitSignature(response);
      return signature;
    } catch (err) {
      throw err;
    }
  }
}
