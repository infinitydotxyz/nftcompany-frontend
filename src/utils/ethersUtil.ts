import { getWyvernChainName } from './commonUtil';

import * as ethers from 'ethers';

// OpenSea's dependencies:
const Web3 = require('web3');
const OpenSeaPort = require('../../opensea').OpenSeaPort;
const WyvernSchemaName = require('../../opensea').WyvernSchemaName;

declare global {
  interface Window {
    ethereum: any;
  }
}

type initEthersArgs = {
  onError?: (tx: any) => void;
  onPending?: (tx: any) => void;
};

export async function initEthers({ onError, onPending }: initEthersArgs = {}) {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (err: any) {
    console.log(err);
    return;
  }
  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

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

export const getEthersProvider = () => new ethers.providers.Web3Provider(window.ethereum);

export const getAccount = async () => {
  try {
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    if (!ethersProvider) {
      return '';
    }
    return await ethersProvider.getSigner().getAddress();
  } catch (err) {
    console.error(err);
    return '';
  }
};

export const getChainId = async () => {
  try {
    const chainIdLoc = await window.ethereum.request({ method: 'eth_chainId' });

    if (chainIdLoc === '0x1') {
      // eth main
      return '1';
    } else if (chainIdLoc === '0x89') {
      // polygon
      return '137';
    }
  } catch (err) {
    console.error('eth_chainId failed', err);
  }
  return '';
};

export const getAddressBalance = async (address: string) => {
  try {
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await ethersProvider.getBalance(address);
    const ret = ethers.utils.formatEther(balance);
    return ret;
  } catch (err) {
    console.error('ERROR:', err);
  }
  return null;
};

/* ------------ web3 utils ------------ */

export const getWeb3 = () => {
  let web3 = new Web3();
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  } else if ((window as any).web3) {
    web3 = new Web3(web3.currentProvider);
  } else {
    alert('Please install MetaMask');
  }
  return web3;
};

export const getOpenSeaportForChain = (chainId?: string) => {
  let network = getWyvernChainName(chainId);
  if (!network) {
    network = 'main';
  }
  const openSeaPortForChain = new OpenSeaPort(getWeb3().currentProvider, {
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
