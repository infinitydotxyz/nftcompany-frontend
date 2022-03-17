import { JsonRpcSigner } from '@ethersproject/providers';
import { BigNumberish, BytesLike, ethers } from 'ethers';
import { defaultAbiCoder, _TypedDataEncoder } from 'ethers/lib/utils';

export interface OBOrder {
  signerAddress: string;
  numItems: BigNumberish;
  amount: BigNumberish;
  startTime: BigNumberish;
  endTime: BigNumberish;
  isSellOrder: boolean;
  complicationAddress: string;
  currencyAddress: string;
  nonce: BigNumberish;
  minBpsToSeller: BigNumberish;
  collectionAddresses: string[];
  tokenIds: BigNumberish[];
}

export interface SignedOBOrder {
  signer: string;
  numItems: BigNumberish;
  amount: BigNumberish;
  startAndEndTimes: BytesLike;
  execInfo: BytesLike;
  params: BytesLike;
  sig: BytesLike;
}

export interface SignedAndHashedOBOrder {
  signedOrder: SignedOBOrder;
  hash: BytesLike;
}

export interface OBOrderAbiEncodedValues {
  startAndEndTimes: BytesLike;
  execInfo: BytesLike;
  params: BytesLike;
}

export async function createOBOrder(
  chainId: BigNumberish,
  contractAddress: string,
  signer: JsonRpcSigner,
  order: OBOrder
): Promise<SignedAndHashedOBOrder> {
  const signedAndHashedOBOrder = await signOBOrder(chainId, contractAddress, signer, order);
  return signedAndHashedOBOrder;
}

export const signOBOrder = async (
  chainId: BigNumberish,
  contractAddress: string,
  signer: JsonRpcSigner,
  order: OBOrder
): Promise<SignedAndHashedOBOrder> => {
  const domain = {
    name: 'InfinityExchange',
    version: '1',
    chainId: chainId,
    verifyingContract: contractAddress
  };
  const types = {
    OBOrder: [
      { name: 'signer', type: 'address' },
      { name: 'numItems', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'startAndEndTimes', type: 'bytes' },
      { name: 'execInfo', type: 'bytes' },
      { name: 'params', type: 'bytes' }
    ]
  };

  const { startAndEndTimes, execInfo, params } = getAbiEncodedValues(order);

  const orderToSign = {
    signer: order.signerAddress,
    numItems: order.numItems,
    amount: order.amount,
    startAndEndTimes,
    execInfo,
    params
  };

  const signedOrder: SignedOBOrder = {
    ...orderToSign,
    sig: ''
  };

  // hash order
  const orderHash = _TypedDataEncoder.hash(domain, types, orderToSign);
  // sign order
  signedOrder.sig = await signer._signTypedData(domain, types, orderToSign);
  // return
  return { signedOrder, hash: orderHash };
};

export const getAbiEncodedValues = (order: OBOrder): OBOrderAbiEncodedValues => {
  // start and end times
  const startTime = order.startTime;
  const endTime = order.endTime;
  const startAndEndTimes = defaultAbiCoder.encode(['uint256', 'uint256'], [startTime, endTime]);

  // execInfo
  const isSellOrder = order.isSellOrder;
  const complicationAddress = order.complicationAddress;
  const currencyAddress = order.currencyAddress;
  const nonce = order.nonce;
  const minBpsToSeller = order.minBpsToSeller;
  const execInfo = defaultAbiCoder.encode(
    ['bool', 'address', 'address', 'uint256', 'uint256'],
    [isSellOrder, complicationAddress, currencyAddress, nonce, minBpsToSeller]
  );

  // params
  const collectionAddresses = order.collectionAddresses;
  const tokenIds = order.tokenIds;
  const params = defaultAbiCoder.encode(['address[]', 'uint256[]'], [collectionAddresses, tokenIds]);

  return { startAndEndTimes, execInfo, params };
};

// below functions are for reference only

const _getOrderHash = (order: OBOrder): string => {
  const { startAndEndTimes, execInfo, params } = getAbiEncodedValues(order);
  const OB_ORDER_HASH = '0xa3a5f07081083fb7946fff7d08befc3dcf87b843a21b8e8b961d00d0afa67a25';
  const toSignvalues = {
    signer: order.signerAddress,
    numItems: order.numItems,
    amount: order.amount,
    startAndEndTimes: ethers.utils.keccak256(startAndEndTimes),
    execInfo: ethers.utils.keccak256(execInfo),
    params: ethers.utils.keccak256(params)
  };
  const orderHash = ethers.utils.keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'address', 'uint256', 'uint256', 'bytes32', 'bytes32', 'bytes32'],
      [
        OB_ORDER_HASH,
        toSignvalues.signer,
        toSignvalues.numItems,
        toSignvalues.amount,
        toSignvalues.startAndEndTimes,
        toSignvalues.execInfo,
        toSignvalues.params
      ]
    )
  );
  return orderHash;
};

const _getDomainSeparator = (chainId: BigNumberish, exchange: BytesLike): BytesLike => {
  const domainSeparator = ethers.utils.keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        '0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f', // keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")
        '0xcd07a2d5dd0d50cbe9aef4d6509941c5576ea10e93ff919a6e4d463e00c5c9f8', // keccak256("InfinityExchange")
        '0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6', // keccak256(bytes("1")) for versionId = 1
        chainId,
        exchange
      ]
    )
  );
  console.log('domainSeparator', domainSeparator);
  return domainSeparator;
};

const _getDigest = (chainId: BigNumberish, exchange: BytesLike, orderHash: BytesLike): BytesLike => {
  const domainSeparator = _getDomainSeparator(chainId, exchange);
  return ethers.utils.solidityKeccak256(['string', 'bytes32', 'bytes32'], ['\x19\x01', domainSeparator, orderHash]);
};
