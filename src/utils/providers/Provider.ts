import { Signature } from 'ethers';
import { ProviderEvents, WalletType } from './AbstractProvider';

export interface Provider {
  account: string;

  chainId: string;

  isConnected: boolean;

  type: WalletType;

  init(): Promise<void>;

  personalSign(message: string): Promise<Signature>;

  getAccounts(): Promise<string[]>;

  disconnect(): void;

  on(event: ProviderEvents, listener: (data: any) => void): void;

  removeListener(event: ProviderEvents, listener: (data: any) => void): void;
}
