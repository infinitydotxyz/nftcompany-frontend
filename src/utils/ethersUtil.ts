const ethers = require('ethers');

// OpenSea's dependencies:
const Web3 = require('web3');
const OpenSeaPort = require('../../opensea').OpenSeaPort;
const Network = require('../../opensea').Network;
const WyvernSchemaName = require('../../opensea').WyvernSchemaName;

declare global {
  interface Window {
    ethereum: any;
  }
}
// const hstABI = require("human-standard-token-abi");

let ethersProvider: any;
let openSeaPort: any;

type initEthersArgs = {
  onError?: (tx: any) => void;
}

export async function initEthers({ onError }: initEthersArgs = {}) {
  if (!window?.ethereum) {
    alert('Please install the MetaMask extension first.');
    return;
  }

  try {
    // deprecated: await window.ethereum.enable();
    // so you are required to call this instead
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    console.log('accounts:', accounts);
  } catch (err: any) {
    console.log(err);
  }

  ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

  console.log('** initEthers')
  ethersProvider.on('pending', (tx: any) => {
    // Emitted when any new pending transaction is noticed
    console.log('- ethersProvider - PENDING:', tx);
  });

  ethersProvider.on('error', (tx: any) => {
    // Emitted when any error occurs
    console.log('- ethersProvider - ERROR:', tx);
    onError && onError(tx);
  });

  return ethersProvider;
}

export const getEthersProvider = () => ethersProvider;

export const getAccount = async () => {
  try {
    if (!ethersProvider) {
      ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    }
    if (!ethersProvider) {
      return '';
    }
    return await ethersProvider.getSigner().getAddress();
  } catch (err) {
    console.error(err);
    return '';
  }
};

export const getAddressBalance = async (address: string) => {
  if (!ethersProvider) {
    ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
  }
  try {
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
    alert('Please install the MetaMask extension first.');
  }
  return web3;
};

export const getOpenSeaport = () => {
  if (openSeaPort) {
    return openSeaPort;
  }
  const network = getChainName();
  openSeaPort = new OpenSeaPort(getWeb3().currentProvider, {
    networkName: network
  });
  return openSeaPort;
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
  const chainId = Number(window.ethereum.request({ method: 'net_version' }).result);
  if (chainId === 1) {
    return 'main';
  } else if (chainId === 4) {
    return 'rinkeby';
  }
  return null;
};

export const weiToEther = (wei: number) => ethers.utils.formatEther(wei);
