export interface NftListing {
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
}

export interface Asset {
  id: string;
  address: string;
  quantity: string;
  imagePreview: string;
  title: string;
  image: string;
}
