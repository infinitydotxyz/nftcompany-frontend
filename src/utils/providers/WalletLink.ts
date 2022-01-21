import { ethers, Signature } from 'ethers';
import { PROVIDER_URL_MAINNET, SITE_HOST } from 'utils/constants';
import WalletLinkProvider from 'walletlink';
import { WalletLinkOptions } from 'walletlink/dist/WalletLink';
import { AbstractProvider, WalletType } from './AbstractProvider';
import { JSONRPCRequestPayload } from './Provider';
import { UserRejectException } from './UserRejectException';

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
    this.registerListeners();
    try {
      const accounts = await this.getAccounts();
      this.account = accounts[0];
      const chainId = await this.getChainId();
      this.chainId = chainId;
      if (this.account) {
        this.isConnected = true;
      }
    } catch (err: Error | any) {
      if (err?.code === 4001) {
        throw new UserRejectException(this.type);
      }
      throw new Error();
    }
  }

  async getAccounts() {
    return await this.web3Provider.send('eth_requestAccounts');
  }

  async getChainId() {
    const hexChainId = await this.web3Provider.send('eth_chainId');
    const chainId = parseInt(hexChainId, 16);
    return chainId;
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
    } catch (err: Error | any) {
      if (err?.code === 4001) {
        // EIP-1193 userRejectedRequest error
        throw new UserRejectException(this.type);
      }
      throw err;
    }
  }

  async request(request: JSONRPCRequestPayload) {
    const response = await this.web3Provider.request(request);
    return { result: response, id: request.id, jsonrpc: request.jsonrpc };
  }

  disconnect(): void {
    this._provider?.disconnect?.();
    this.isConnected = false;
  }

  registerListeners(): void {
    /**
     * wallet link doesn't seem to support events
     *
     * instead we set isConnected after finding a wallet
     * and after calling disconnect
     *
     */
  }
}
