import { Signature } from 'ethers';
import { ProviderEvents, WalletType } from './AbstractProvider';
type Web3Provider = any;
export interface JSONRPCRequestPayload {
  params: any[];
  method: string;
  id: number;
  jsonrpc: string;
}

export interface JSONRPCResponsePayload {
  result: any;
  id: number;
  jsonrpc: string;
}

export interface Provider {
  account: string;

  chainId: number;

  isConnected: boolean;

  type: WalletType;

  init(): Promise<void>;

  personalSign(message: string): Promise<Signature>;

  getAccounts(): Promise<string[]>;

  getChainId(): Promise<number>;

  disconnect(): void;

  on(event: ProviderEvents, listener: (data: any) => void): void;

  removeListener(event: ProviderEvents, listener: (data: any) => void): void;

  sendAsync: (
    request: JSONRPCRequestPayload,
    callback: (error?: any, response?: JSONRPCResponsePayload) => void
  ) => void;

  send: (request: JSONRPCRequestPayload, callback: (error?: any, response?: JSONRPCResponsePayload) => void) => void;

  request(request: JSONRPCRequestPayload): Promise<JSONRPCResponsePayload>;
}
