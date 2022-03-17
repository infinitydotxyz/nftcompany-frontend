import { BigNumberish, Contract, Wallet, BytesLike, Signature } from 'ethers';
import { defaultAbiCoder, splitSignature } from 'ethers/lib/utils';

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

export interface SignedOBOrder extends OBOrder {
  hash: string;
  sig: Signature;
}

export interface OBOrderAbiEncodedValues {
  startAndEndTimes: BytesLike;
  execInfo: BytesLike;
  params: BytesLike;
}

export async function createOBOrder(
  chainId: BigNumberish,
  exchange: Contract,
  owner: Wallet,
  order: OBOrder
): Promise<SignedOBOrder> {
  const signedOBOrder = await signOBOrder(chainId, exchange, owner, order);
  return signedOBOrder;
}

export const signOBOrder = async (
  chainId: BigNumberish,
  contract: Contract,
  owner: Wallet,
  order: OBOrder
): Promise<SignedOBOrder> => {
  const domain = {
    name: 'InfinityExchange',
    version: '1',
    chainId: chainId,
    verifyingContract: contract.address
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

  const values = {
    signer: order.signerAddress,
    numItems: order.numItems,
    amount: order.amount,
    startAndEndTimes,
    execInfo,
    params
  };

  // sign order
  const signedOrderHash = await owner._signTypedData(domain, types, values);
  // split signature
  const sig = splitSignature(signedOrderHash);
  // return
  return { ...order, hash: signedOrderHash, sig };
};

export const getAbiEncodedValues = (order: OBOrder | SignedOBOrder): OBOrderAbiEncodedValues => {
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
