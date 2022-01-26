import { getWyvernChainName } from './commonUtil';
import * as ethers from 'ethers';
import { ProviderManager } from './providers/ProviderManager';

// OpenSea's dependencies:
const OpenSeaPort = require('../../opensea').OpenSeaPort;
const WyvernSchemaName = require('../../opensea').WyvernSchemaName;

declare global {
  interface Window {
    // @ts-ignore walletlink defines this as well
    ethereum: any;
  }
}

export const getEthersProvider = (provider: ethers.providers.ExternalProvider) => {
  return new ethers.providers.Web3Provider(provider);
};

/* ------------ web3 utils ------------ */

export const getOpenSeaportForChain = (chainId: string = '', providerManager?: ProviderManager) => {
  let network = getWyvernChainName(chainId);
  if (!network) {
    network = 'main';
  }

  const web3Provider = providerManager;

  const openSeaPortForChain = new OpenSeaPort(web3Provider, {
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
