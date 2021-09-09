import { API_BASE } from './constants';
import axios from 'axios';

const ethers = require('ethers');

// OpenSea's dependencies:
const Web3 = require('web3');
const OpenSeaPort = require('../../src-os/src').OpenSeaPort;
const Network = require('../../src-os/src').Network;
const WyvernSchemaName = require('../../src-os/src').WyvernSchemaName;

declare global {
  interface Window {
    ethereum: any;
  }
}
// const hstABI = require("human-standard-token-abi");

let provider: any;

export async function initEthers() {
  if (!window?.ethereum) {
    alert('Please install the MetaMask extension first.');
    return;
  }
  await window.ethereum.enable();
  provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const network = Number(window.ethereum.send({ method: 'net_version' }).result);
  return signer;
}

// todo: adi - change to ethersProvider
export const getProvider = () => provider;

export const getAccount = async () => {
  if (!window || !window.ethereum) {
    return null;
  }
  let account = null;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    // console.log('accounts', accounts);
    if (Array.isArray(accounts) && accounts.length > 0) {
      account = accounts[0];

      if (!provider) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
      }
    }
  } catch (err) {
    console.error('ERROR:', err);
  }
  return account;
};

export const getAddressBalance = async (address: string) => {
  if (!window || !window.ethereum) {
    return null;
  }
  try {
    const balance = await provider.getBalance(address);
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
    // try {
    //   window.ethereum.enable().then(() => {
    //     // User has allowed account access to DApp...
    //   })
    // } catch (e) {
    //   // User has denied account access to DApp...
    // }
  } else if ((window as any).web3) {
    web3 = new Web3(web3.currentProvider);
  } else {
    alert('Please install the MetaMask extension first.');
  }
  return web3;
};

export const web3GetSeaport = () => {
  const network = getChainName();
  const seaport = new OpenSeaPort(getWeb3().currentProvider, {
    networkName: network
  });
  return seaport;
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
// we only support main and rinkeby for now so lets only allow those chainIds
export const getChainName = (): string | null => {
  const chainId = Number(window.ethereum.send({ method: 'net_version' }).result);
  if (chainId === 1) {
    return 'main';
  } else if (chainId === 4) {
    return 'rinkeby';
  }
  return null;
};

export const weiToEther = (wei: number) => ethers.utils.formatEther(wei);
