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
  createdAt: string;
  basePriceInEth: number;
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
  description?: string;
  image: string;
  imagePreview?: string;
  price?: number;
  inStock?: number;
  data?: any;
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
};
