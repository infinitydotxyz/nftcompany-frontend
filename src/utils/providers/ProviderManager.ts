/* eslint-disable no-useless-constructor */
import { ethers, Signature } from 'ethers';
import { LOGIN_MESSAGE } from 'utils/constants';
import { Optional } from 'utils/typeUtils';
import { ProviderEvents, WalletType } from './AbstractProvider';
import { MetaMask } from './MetaMask';
import { Provider } from './Provider';
import { UserRejectException } from './UserRejectException';
import { WalletConnect } from './WalletConnect';
import { WalletLink } from './WalletLink';
import EventEmitter from 'events';

enum StorageKeys {
  CurrentUser = 'CURRENT_USER',
  AuthSignature = 'X-AUTH-SIGNATURE',
  AuthMessage = 'X-AUTH-MESSAGE',
  Wallet = 'WALLET'
}
export class ProviderManager implements Omit<Optional<Provider, 'type'>, 'init'> {
  private _provider?: Provider;

  private _emitter: EventEmitter;

  private currentUser?: string;
  private authSignature?: Signature;
  private authMessage?: string;

  /**
   * SINGLETON
   */
  private static instance: ProviderManager;
  public static async getInstance() {
    if (!this.instance) {
      this.instance = new this();
      await this.instance.refresh();
    }

    return this.instance;
  }
  // eslint-disable-next-line no-empty-function
  private constructor() {
    this._emitter = new EventEmitter();
  }

  get account() {
    return this._provider?.account ?? '';
  }

  get chainId() {
    return this._provider?.chainId ?? 1;
  }

  get isConnected() {
    return this._provider?.isConnected ?? false;
  }

  get type() {
    return this._provider?.type;
  }

  personalSign(message: string): Promise<Signature> {
    if (this._provider) {
      return this._provider.personalSign(message);
    }

    throw new Error('No provider');
  }

  getAccounts(): Promise<string[]> {
    if (this._provider) {
      return this._provider.getAccounts();
    }
    throw new Error('No provider');
  }

  getChainId() {
    if (this._provider) {
      return this._provider.getChainId();
    }
    throw new Error('No provider');
  }

  disconnect(): void {
    try {
      this._provider?.disconnect?.();
    } catch {}
    this._provider = undefined;
    this.authMessage = '';
    this.authSignature = undefined;
    this.save();
  }

  on(event: ProviderEvents, listener: (data: any) => void): void {
    this._emitter.on(event, listener);
  }

  removeListener(event: ProviderEvents, listener: (data: any) => void): void {
    this._emitter.removeListener(event, listener);
  }

  /**
   * connectWallet creates a new provider and
   * @param walletType
   */
  async connectWallet(walletType: WalletType) {
    try {
      const provider = this.createProvider(walletType);

      if (provider) {
        let prevChainId = this._provider?.chainId;
        let prevAccount = this._provider?.account;

        this._provider = provider;
        this.save();

        this._provider.on(ProviderEvents.AccountsChanged, (account: string) => {
          if (account !== prevAccount) {
            this._emitter.emit(ProviderEvents.AccountsChanged, account);
            prevAccount = account;
          }
        });

        this._provider.on(ProviderEvents.ChainChanged, (chainId: number) => {
          if (chainId !== prevChainId) {
            this._emitter.emit(ProviderEvents.ChainChanged, chainId);
            prevChainId = chainId;
          }
        });

        this._provider.on(ProviderEvents.Connect, () => {
          this._emitter.emit(ProviderEvents.Connect);
        });

        this._provider.on(ProviderEvents.Disconnect, () => {
          this._emitter.emit(ProviderEvents.Disconnect);
        });

        await this._provider.init();
      }
    } catch (err: Error | UserRejectException | any) {
      throw err;
    }
  }

  async signIn() {
    /**
     *
     *
     *
     * // TODO get chain id
     *
     *
     */

    const currentUser = this.account.toLowerCase();
    if (currentUser && this.authMessage && this.authSignature) {
      try {
        const signer = ethers.utils.verifyMessage(this.authMessage, this.authSignature).toLowerCase();
        if (currentUser === signer) {
          return;
        }
      } catch (err) {
        console.log(err);
        return;
      }
    }

    const signature = await this.personalSign(LOGIN_MESSAGE);
    this.authSignature = signature;
    this.authMessage = LOGIN_MESSAGE;
    this.save();
  }

  /**
   * createProvider is a provider factory method
   * throws an error if the wallet type is not supported
   */
  private createProvider(type: WalletType) {
    switch (type) {
      case WalletType.MetaMask:
        return new MetaMask();
      case WalletType.WalletLink:
        return new WalletLink();

      case WalletType.WalletConnect:
        return new WalletConnect();

      default:
        return;
    }
  }

  /**
   * persist wallet type
   */
  private save() {
    localStorage.setItem(StorageKeys.Wallet, this._provider?.type ?? '');
    localStorage.setItem(StorageKeys.AuthSignature, JSON.stringify(this.authSignature ?? {}));
    localStorage.setItem(StorageKeys.AuthMessage, this.authMessage ?? '');
  }

  /**
   * refresh gets the stored wallet type and attempts tp
   * initialize a wallet
   */
  private async refresh() {
    const preferredWallet = localStorage.getItem(StorageKeys.Wallet);
    const authSignature = localStorage.getItem(StorageKeys.AuthSignature);
    const authMessage = localStorage.getItem(StorageKeys.AuthMessage);
    if (
      preferredWallet === WalletType.MetaMask ||
      preferredWallet === WalletType.WalletLink ||
      preferredWallet === WalletType.WalletConnect
    ) {
      let parsedSignature;
      try {
        parsedSignature = JSON.parse(authSignature || '');
      } catch {}
      if (
        parsedSignature &&
        'r' in parsedSignature &&
        's' in parsedSignature &&
        'v' in parsedSignature &&
        'recoveryParam' in parsedSignature
      ) {
        this.authSignature = parsedSignature as Signature;
      }
      this.authMessage = authMessage ?? '';
      try {
        await this.connectWallet(preferredWallet);
      } catch {}
    }

    return;
  }
}
