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
  abstract personalSign(message: string): Promise<Signature>;

  abstract get web3Provider(): Web3Provider;
}
