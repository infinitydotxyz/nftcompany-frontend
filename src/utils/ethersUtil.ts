import { getWyvernChainName } from './commonUtil';

import * as ethers from 'ethers';
import { ExternalProvider } from '.pnpm/@ethersproject+providers@5.4.5/node_modules/@ethersproject/providers';
import { WalletType } from './context/AppContext';

// OpenSea's dependencies:
const Web3 = require('web3');
const OpenSeaPort = require('../../opensea').OpenSeaPort;
const WyvernSchemaName = require('../../opensea').WyvernSchemaName;

declare global {
  interface Window {
    // @ts-ignore walletlink defines this as well
    ethereum: any;
  }
}

let preferredWallet: WalletType | undefined = undefined;
export const getProvider = () => {
  if (!preferredWallet) {
    const res = localStorage.getItem('WALLET');
    if (res === WalletType.MetaMask || res === WalletType.WalletConnect || res === WalletType.WalletLink) {
      preferredWallet = res;
    }
  }
  switch (preferredWallet) {
    case WalletType.MetaMask:
      return ((window.ethereum as any)?.providers ?? [window.ethereum]).find((p: any) => p.isMetaMask);
    case WalletType.WalletLink:
      return ((window.ethereum as any)?.providers ?? [window.ethereum]).find((p: any) => p.isCoinbaseWallet);
    case WalletType.WalletConnect:
      return ((window.ethereum as any)?.providers ?? [window.ethereum]).find((p: any) => p.isWalletConnect);
    default:
  }
};

export const setPreferredWallet = (walletType?: WalletType) => {
  preferredWallet = walletType;
  localStorage.setItem('WALLET', preferredWallet ?? '');
};

export const getEthersProvider = (provider?: ethers.providers.ExternalProvider) => {
  return new ethers.providers.Web3Provider(provider ?? getProvider());
};

type initEthersArgs = {
  provider: ExternalProvider;
  onError?: (tx: any) => void;
  onPending?: (tx: any) => void;
};

export async function initEthers({ provider, onError, onPending }: initEthersArgs) {
  try {
    if (provider) {
      await provider.request?.({ method: 'eth_requestAccounts' });
    }
  } catch (err: any) {
    console.log(err);
    return;
  }
  const ethersProvider = getEthersProvider(provider);

  if (!ethersProvider) {
    return;
  }

  ethersProvider.on('pending', (tx: any) => {
    // Emitted when any new pending transaction is noticed
    console.log('- ethersProvider - PENDING:', tx);
    onPending?.(tx);
  });

  ethersProvider.on('error', (tx: any) => {
    // Emitted when any error occurs
    console.log('- ethersProvider - ERROR:', tx);
    onError?.(tx);
  });

  return ethersProvider;
}

export const getAccount = async (provider?: ethers.providers.ExternalProvider) => {
  try {
    const ethersProvider = getEthersProvider(provider);
    if (!ethersProvider) {
      return '';
    }
    return await ethersProvider.getSigner().getAddress();
  } catch (err) {
    console.error(err);
    return '';
  }
};

export const getChainId = async (provider: ethers.providers.ExternalProvider) => {
  try {
    if (!provider) {
      return '';
    }

    const chainIdLoc = await provider?.request?.({ method: 'eth_chainId' });
    console.log('chain id loc', chainIdLoc);
    if (chainIdLoc === '0x1') {
      // eth main
      return '1';
    } else if (chainIdLoc === '0x89') {
      // polygon
      return '137';
    } else if (chainIdLoc === '0x7a69') {
      // localhost hardhat
      return '31337';
    }
  } catch (err) {
    console.error('eth_chainId failed', err);
  }
  return '';
};

export const getAddressBalance = async (address: string, provider: ethers.providers.ExternalProvider) => {
  try {
    const ethersProvider = getEthersProvider(provider);
    if (!ethersProvider) {
      return;
    }
    const balance = await ethersProvider.getBalance(address);
    const ret = ethers.utils.formatEther(balance);
    return ret;
  } catch (err) {
    console.error('ERROR:', err);
  }
  return null;
};

/* ------------ web3 utils ------------ */

export const getWeb3 = (provider?: ethers.providers.ExternalProvider) => {
  let web3 = new Web3();
  if (provider) {
    web3 = new Web3(provider);
  } else if ((window as any).web3) {
    web3 = new Web3(web3.currentProvider);
  } else {
    alert('Please install MetaMask');
  }
  return web3;
};

export const getOpenSeaportForChain = (chainId: string = '', provider?: ethers.providers.ExternalProvider) => {
  let network = getWyvernChainName(chainId);
  if (!network) {
    network = 'main';
  }
  const openSeaPortForChain = new OpenSeaPort(getWeb3(provider ?? getProvider()).currentProvider, {
    networkName: network
  });
  return openSeaPortForChain;
};

export const getSchemaName = (address: string) => {
  // opensea shared store front
  if (address.trim().toLowerCase() === '0x495f947276749ce646f68ac8c248420045cb7b5e') {
    return WyvernSchemaName.ERC1155;
  } else if (address.trim().toLowerCase() === '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb') {
    return WyvernSchemaName.CryptoPunks;
  } else {
    return WyvernSchemaName.ERC721;
  }
};

export const weiToEther = (wei: ethers.BigNumberish) => ethers.utils.formatEther(wei);
