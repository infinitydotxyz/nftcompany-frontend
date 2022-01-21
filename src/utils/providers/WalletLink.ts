import { ethers, Signature } from 'ethers';
import { PROVIDER_URL_MAINNET, SITE_HOST } from 'utils/constants';
import WalletLinkProvider from 'walletlink';
import { WalletLinkOptions } from 'walletlink/dist/WalletLink';
import { AbstractProvider, WalletType } from './AbstractProvider';

const APP_NAME = 'infinity.xyz';
const APP_LOGO_URL = `${SITE_HOST}/favicon.ico`;
const ETH_JSONRPC_URL = PROVIDER_URL_MAINNET;
const CHAIN_ID = 1;
const walletLinkOptions: WalletLinkOptions = {
  appName: APP_NAME,
  appLogoUrl: APP_LOGO_URL,
  darkMode: false,
  overrideIsMetaMask: false
};

export class WalletLink extends AbstractProvider {
  private _provider: WalletLinkProvider;

  public readonly type = WalletType.WalletLink;

  constructor() {
    super();
    this._provider = new WalletLinkProvider(walletLinkOptions);
  }

  get web3Provider() {
    return this._provider.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID);
  }

  async init() {
    try {
      const accounts = await this.web3Provider.send('eth_requestAccounts');
      this.account = accounts[0];
    } catch (err: Error | any) {
      if (err?.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to WalletLink.');
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
      const response: string = await this.web3Provider.request({
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
