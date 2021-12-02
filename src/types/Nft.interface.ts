export interface Order {
  id: string;
  blueCheck: boolean;
  howToCall: number;
  salt: string;
  feeRecipient: string;
  staticExtradata: string;
  quantity: string;
  staticTarget: string;
  maker: string;
  side: number;
  takerProtocolFee: string;
  saleKind: number;
  basePrice: number;
  metadata: Metadata;
  extra: string;
  expirationTime: string;
  hasBonusReward: boolean;
  calldata: string;
  hash: string;
  r: string;
  replacementPattern: string;
  taker: string;
  takerRelayerFee: string;
  s: string;
  makerRelayerFee: string;
  listingTime: string;
  target: string;
  v: number;
  makerProtocolFee: string;
  paymentToken: string;
  feeMethod: number;
  exchange: string;
  makerReferrerFee: string;
}

export interface Metadata {
  asset: Asset;
  hasBonusReward: boolean;
  schema: string;
  hasBlueCheck: boolean;
  createdAt: number;
  basePriceInEth: number;
  listingType: string;
  chainId: string;
}

export interface Asset {
  id: string;
  address: string;
  quantity: string;
  imagePreview: string;
  title: string;
  description: string;
  image: string;
  owner: string;
  collectionName: string;
  searchCollectionName?: string;
  searchTitle?: string;
}

export interface Orders {
  count: number;
  listings: Order[];
}

export type CardData = {
  id: string;
  title: string;
  name?: string;
  description?: string;
  image?: string;
  cardImage?: string;
  imagePreview?: string;
  price?: number;
  inStock?: number;
  order?: Order;
  tokenAddress?: string;
  tokenId?: string;
  collectionName?: string;
  maker?: string;
  hasBonusReward?: boolean;
  hasBlueCheck?: boolean;
  owner?: string;
  metadata?: Metadata;
  schemaName?: string;
  expirationTime?: string;
  chainId?: string;
};

export enum WyvernSchemaName {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  LegacyEnjin = 'Enjin',
  ENSShortNameAuction = 'ENSShortNameAuction',
  CryptoPunks = 'CryptoPunks'
}

/**
 * The NFT version that this contract uses.
 * ERC721 versions are:
 * 1.0: CryptoKitties and early 721s, which lack approve-all and
 *      have problems calling `transferFrom` from the owner's account.
 * 2.0: CryptoSaga and others that lack `transferFrom` and have
 *      `takeOwnership` instead
 * 3.0: The current OpenZeppelin standard:
 *      https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721.sol
 * Special cases:
 * locked: When the transfer function has been locked by the dev
 */
export enum TokenStandardVersion {
  Unsupported = 'unsupported',
  Locked = 'locked',
  Enjin = '1155-1.0',
  ERC721v1 = '1.0',
  ERC721v2 = '2.0',
  ERC721v3 = '3.0'
}
