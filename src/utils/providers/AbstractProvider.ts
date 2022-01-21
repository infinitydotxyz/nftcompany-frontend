import { ethers, Signature } from 'ethers';

export enum WalletType {
  MetaMask = 'MetaMask',
  WalletLink = 'WalletLink',
  WalletConnect = 'WalletConnect'
}

export type Web3Provider = any;

export abstract class AbstractProvider {
  abstract type: WalletType;

  account?: string;

  /**
   * handles initializing the wallet
   * (i.e. connect/open/prompt unlock)
   */
  abstract init(): Promise<void>;

  /**
   * personalSign takes a message to be signed and returns a promise for the
   * signature object (you'll likely have to decode the resulting hex data)
   *
   * @param message to be signed
   */
  async personalSign(message: string): Promise<Signature> {
    const params = [message];
    if (this.account) {
      params.push(this.account);
    }
    try {
      const response: { result: string } = await this.web3Provider.request({
        method: 'personal_sign',
        params
      });
      console.log({ response });
      const signature = ethers.utils.splitSignature(response.result);
      console.log({ signature });
      return signature;
    } catch (err) {
      throw err;
    }
  }

  abstract get web3Provider(): Web3Provider;
}
