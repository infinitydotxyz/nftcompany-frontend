import { BigNumberish, BytesLike, ethers } from 'ethers';
import { defaultAbiCoder, keccak256, solidityKeccak256, splitSignature, _TypedDataEncoder } from 'ethers/lib/utils';
import { NULL_ADDRESS } from 'utils/constants';
import { ProviderManager } from 'utils/providers/ProviderManager';
import {
  BuyOrder,
  BuyOrderMatch,
  isBuyOrder,
  MarketListIdType,
  MarketListingsBody,
  MarketOrder,
  SellOrder
} from '@infinityxyz/lib/types/core';
import { infinityExchangeAbi } from 'abi/infinityExchange';
import { User } from 'utils/context/AppContext';

export interface Item {
  collection: string;
  tokenIds: BigNumberish[];
}

export interface ExecParams {
  complicationAddress: string;
  currencyAddress: string;
}

export interface ExtraParams {
  buyer?: string;
}

export interface OBOrder {
  isSellOrder: boolean;
  signerAddress: string;
  numItems: BigNumberish;
  startPrice: BigNumberish;
  endPrice: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  minBpsToSeller: BigNumberish;
  nonce: BigNumberish;
  nfts: Item[];
  execParams: ExecParams;
  extraParams: ExtraParams;
}

export interface SignedOBOrder {
  isSellOrder: boolean;
  signer: string;
  constraints: BigNumberish[];
  nfts: Item[];
  execParams: string[];
  extraParams: BytesLike;
  sig: BytesLike;
}

// Orderbook orders

export async function makeOBOrder(
  user: User,
  chainId: BigNumberish,
  providerManager: ProviderManager,
  order: BuyOrder
): Promise<SignedOBOrder | undefined> {
  const exchange = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'.toLowerCase();
  const complicationAddress = '0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429';
  const collections = ['0x276C216D241856199A83bf27b2286659e5b877D3'];
  const signer = providerManager?.getEthersProvider().getSigner();

  const nfts: Item[] = [
    {
      collection: collections[0],
      tokenIds: []
    }
  ];
  const execParams = { complicationAddress, currencyAddress: NULL_ADDRESS };
  const extraParams: ExtraParams = {};

  const obOrder: OBOrder = {
    isSellOrder: false,
    signerAddress: user!.account,
    numItems: order.minNFTs,
    startPrice: order.budget,
    endPrice: order.budget,
    startTime: order.startTime,
    endTime: order.endTime,
    minBpsToSeller: 9000,
    nonce: 1,
    nfts,
    execParams,
    extraParams
  };

  if (signer) {
    const signedOBOrder = await createOBOrder(chainId, exchange, providerManager, obOrder);
    const infinityExchange = new ethers.Contract(exchange, infinityExchangeAbi, signer);
    const isSigValid = await infinityExchange.verifyOrderSig(signedOBOrder);
    console.log('Sig valid:', isSigValid);
    return signedOBOrder;
  } else {
    console.error('No signer. Are you logged in?');
  }
}

export async function createOBOrder(
  chainId: BigNumberish,
  contractAddress: string,
  providerManager: ProviderManager | undefined,
  order: OBOrder
): Promise<SignedOBOrder> {
  const domain = {
    name: 'InfinityExchange',
    version: '1',
    chainId: chainId,
    verifyingContract: contractAddress
  };

  const types = {
    Order: [
      { name: 'isSellOrder', type: 'bool' },
      { name: 'signer', type: 'address' },
      { name: 'dataHash', type: 'bytes32' },
      { name: 'extraParams', type: 'bytes' }
    ]
  };

  const calcDigest = _getCalculatedDigest(chainId, contractAddress, order);

  const signedOBOrder = await signOBOrder(domain, types, providerManager, order);
  return signedOBOrder;
}

export async function signOBOrder(
  domain: any,
  types: any,
  providerManager: ProviderManager | undefined,
  order: OBOrder
): Promise<SignedOBOrder> {
  const constraints = [
    order.numItems,
    order.startPrice,
    order.endPrice,
    order.startTime,
    order.endTime,
    order.minBpsToSeller,
    order.nonce
  ];
  const constraintsHash = keccak256(
    defaultAbiCoder.encode(['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'], constraints)
  );

  let encodedItems = '';
  for (const item of order.nfts) {
    const collection = item.collection;
    const tokenIds = item.tokenIds;
    encodedItems += defaultAbiCoder.encode(['address', 'uint256[]'], [collection, tokenIds]);
  }
  const encodedItemsHash = keccak256(encodedItems);

  const execParams = [order.execParams.complicationAddress, order.execParams.currencyAddress];
  const execParamsHash = keccak256(defaultAbiCoder.encode(['address', 'address'], execParams));

  const dataHash = keccak256(
    defaultAbiCoder.encode(['bytes32', 'bytes32', 'bytes32'], [constraintsHash, encodedItemsHash, execParamsHash])
  );

  const extraParams = defaultAbiCoder.encode(['address'], [order.extraParams.buyer ?? NULL_ADDRESS]);

  const orderToSign = {
    isSellOrder: order.isSellOrder,
    signer: order.signerAddress,
    dataHash,
    extraParams
  };

  const signedOrder: SignedOBOrder = {
    ...orderToSign,
    nfts: order.nfts,
    constraints,
    execParams,
    sig: ''
  };

  _printTypeEncodedData(domain, types, orderToSign);

  // sign order
  try {
    const sig = await providerManager?.getEthersProvider().getSigner()._signTypedData(domain, types, orderToSign);
    const splitSig = splitSignature(sig ?? '');
    const encodedSig = defaultAbiCoder.encode(['bytes32', 'bytes32', 'uint8'], [splitSig.r, splitSig.s, splitSig.v]);
    signedOrder.sig = encodedSig;
  } catch (e) {
    console.error('Error signing order', e);
  }

  // return
  return signedOrder;
}

// ================================= Below functions are for reference & testing only =====================================
// ================================= Below functions are for reference & testing only =====================================

function _getCalculatedDigest(chainId: BigNumberish, exchange: string, order: OBOrder): BytesLike {
  const fnSign = 'Order(bool isSellOrder,address signer,bytes32 dataHash,bytes extraParams)';
  const orderTypeHash = solidityKeccak256(['string'], [fnSign]);
  console.log('Order type hash', orderTypeHash);

  const constraints = [
    order.numItems,
    order.startPrice,
    order.endPrice,
    order.startTime,
    order.endTime,
    order.minBpsToSeller,
    order.nonce
  ];
  const constraintsHash = keccak256(
    defaultAbiCoder.encode(['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'], constraints)
  );

  let encodedItems = '';
  for (const item of order.nfts) {
    const collection = item.collection;
    const tokenIds = item.tokenIds;
    encodedItems += defaultAbiCoder.encode(['address', 'uint256[]'], [collection, tokenIds]);
  }
  const encodedItemsHash = keccak256(encodedItems);

  const execParams = [order.execParams.complicationAddress, order.execParams.currencyAddress];
  const execParamsHash = keccak256(defaultAbiCoder.encode(['address', 'address'], execParams));

  const dataHash = keccak256(
    defaultAbiCoder.encode(['bytes32', 'bytes32', 'bytes32'], [constraintsHash, encodedItemsHash, execParamsHash])
  );

  const extraParams = defaultAbiCoder.encode(['address'], [order.extraParams.buyer ?? NULL_ADDRESS]);

  const orderHash = keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bool', 'address', 'bytes32', 'bytes32'],
      [orderTypeHash, order.isSellOrder, order.signerAddress, dataHash, keccak256(extraParams)]
    )
  );

  console.log('calculated orderHash', orderHash);
  const digest = _getDigest(chainId, exchange, orderHash);
  console.log('calculated digest', digest);
  return digest;
}

function _getDigest(chainId: BigNumberish, exchange: BytesLike | string, orderHash: string | BytesLike): BytesLike {
  const domainSeparator = _getDomainSeparator(chainId, exchange);
  return solidityKeccak256(['string', 'bytes32', 'bytes32'], ['\x19\x01', domainSeparator, orderHash]);
}

function _getDomainSeparator(chainId: BigNumberish, exchange: BytesLike): BytesLike {
  const domainSeparator = ethers.utils.keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        solidityKeccak256(
          ['string'],
          ['EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)']
        ),
        solidityKeccak256(['string'], ['InfinityExchange']),
        solidityKeccak256(['string'], ['1']), // for versionId = 1
        chainId,
        exchange
      ]
    )
  );
  console.log('domainSeparator:', domainSeparator);
  return domainSeparator;
}

function _printTypeEncodedData(domain: any, types: any, orderToSign: any) {
  const domainSeparator = _TypedDataEncoder.hashDomain(domain);
  const typedDataEncoder = _TypedDataEncoder.from(types);
  const primaryType = typedDataEncoder.primaryType;
  const primary = typedDataEncoder.encodeType(primaryType);
  const hashedType = solidityKeccak256(['string'], [primary]);
  console.log('primary type:', primaryType);
  console.log('domain separator:', domainSeparator);
  console.log('type hash:', hashedType);
  const encodedData = typedDataEncoder.encode(orderToSign);
  const hashedEncoded = typedDataEncoder.hash(orderToSign);
  console.log('encoded typed data:', encodedData);
  console.log('typed data hash:', hashedEncoded);

  const orderDigest = _TypedDataEncoder.hash(domain, types, orderToSign);
  console.log('typed data digest', orderDigest);
}

async function testHash(chainId: BigNumberish, contractAddress: string, providerManager: ProviderManager | undefined) {
  const types = {
    Base: [{ name: 'isSellOrder', type: 'bool' }]
  };

  const typesWithDomain = {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    Base: [{ name: 'isSellOrder', type: 'bool' }]
  };

  const fnSign = 'Base(bool isSellOrder)';
  const baseTypeHash = solidityKeccak256(['string'], [fnSign]);

  const message = { isSellOrder: false };
  const orderHash = ethers.utils.keccak256(defaultAbiCoder.encode(['bytes32', 'bool'], [baseTypeHash, message]));
  console.log('Base', baseTypeHash, orderHash);

  const typedDataEncoder = _TypedDataEncoder.from(types);
  const primaryType = typedDataEncoder.primaryType;
  const primary = typedDataEncoder.encodeType(primaryType);
  const hashedType = solidityKeccak256(['string'], [primary]);
  const hashedEncoded = typedDataEncoder.hash(message);
  console.log(primaryType, hashedType, hashedEncoded);

  const domain = {
    name: 'InfinityExchange',
    version: '1',
    chainId: chainId,
    verifyingContract: contractAddress
  };
  const msgParams = JSON.stringify({
    domain,
    primaryType: 'Base',
    types: typesWithDomain,
    message
  });

  const signer = providerManager?.getEthersProvider().getSigner();
  const sig = await providerManager
    ?.getEthersProvider()
    .send('eth_signTypedData_v4', [await signer?.getAddress(), msgParams]);
  console.log('sig raw method', sig);

  const payload = JSON.stringify(_TypedDataEncoder.getPayload(domain, types, message));
  const sig2 = await signer?._signTypedData(domain, types, message);
  console.log('sig ethers method', sig2);

  console.log('msgParams', msgParams, 'payload', payload);
}
