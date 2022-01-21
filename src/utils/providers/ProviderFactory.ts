import { WalletLink } from './WalletLink';
import { WalletType } from './AbstractProvider';
import { MetaMask } from './MetaMask';
import { WalletConnect } from './WalletConnect';

export function createProvider(type: WalletType) {
  switch (type) {
    case WalletType.MetaMask:
      return new MetaMask();
    case WalletType.WalletLink:
      return new WalletLink();

    case WalletType.WalletConnect:
      return new WalletConnect();

    default:
      throw new Error('Invalid wallet type');
  }
}
