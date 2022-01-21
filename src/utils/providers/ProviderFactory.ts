import { WalletLink } from './WalletLink';
import { WalletType } from './AbstractProvider';
import { MetaMask } from './MetaMask';

export function createProvider(type: WalletType) {
  switch (type) {
    case WalletType.MetaMask:
      return new MetaMask();
    case WalletType.WalletLink:
      return new WalletLink();

    default:
      throw new Error('Wallet type not yet implemented');
  }
}
