import { ethers, Signature } from 'ethers';
import EventEmitter from 'events';
import { Provider } from './Provider';

export enum WalletType {
  MetaMask = 'MetaMask',
  WalletLink = 'WalletLink',
  WalletConnect = 'WalletConnect'
}

export type Web3Provider = any;

export enum ProviderEvents {
  AccountsChanged = 'accountsChanged',
  ChainChanged = 'chainChanged',
  Connect = 'connect',
  Disconnect = 'disconnect'
}

export abstract class AbstractProvider implements Provider {
  abstract type: WalletType;

  private _account?: string;
  private _chainId?: string;
  private _state: 'connected' | 'disconnected' = 'disconnected';

  get account() {
    return this._account ?? '';
  }

  get chainId() {
    return this._chainId ?? '';
  }

  get isConnected() {
    return this._state === 'connected';
  }

  protected set account(account: string) {
    if (this.account === account) {
      return;
    }

    const shouldEmit = !!this._account;
    this._account = account;

    if (shouldEmit) {
      this.emit(ProviderEvents.AccountsChanged, account);
    }
  }

  protected set chainId(chainId: string) {
    if (this._chainId === chainId) {
      return;
    }
    this._chainId = chainId;
    this.emit(ProviderEvents.ChainChanged, chainId);
  }

  protected set isConnected(isConnected: boolean) {
    if (this.isConnected === isConnected) {
      return;
    }
    this._state = isConnected ? 'connected' : 'disconnected';
    if (isConnected) {
      this.emit(ProviderEvents.Connect);
    } else {
      this.emit(ProviderEvents.Disconnect);
    }
  }

  protected emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  abstract get web3Provider(): Web3Provider;

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

  abstract getAccounts(): Promise<string[]>;

  /**
   * disconnects the wallet
   * the user will need to re-connect
   */
  abstract disconnect(): void;

  on(event: ProviderEvents, listener: (data: any) => void): void {
    this.emitter.on(event, listener);
  }

  removeListener(event: ProviderEvents, listener: (data: any) => void): void {
    this.emitter.removeListener(event, listener);
  }

  /**
   * concrete implementations should register listeners on the internal provider
   * and set account/chaindId and isConnected accordingly
   */
  protected abstract registerListeners(): void;

  /**
   * emit is called internally.
   * Use the setters for account, chainId and isConnected when the provider
   * emits an update. these setter handle emitting events
   * @param event to be emitted
   * @param args
   */
  private emit(event: ProviderEvents, ...args: any) {
    this.emitter.emit(event, args);
  }
}
