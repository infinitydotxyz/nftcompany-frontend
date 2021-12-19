export type LeaderBoard = {
  count: number;
  results: LeaderBoardEntries;
};

export type LeaderBoardEntries = {
  saleLeaders: LeaderBoardEntry[];
  buyLeaders: LeaderBoardEntry[];
};

export type LeaderBoardEntry = {
  id: string;
  total: number;
  chainId: string;
};

// ===========================================================

export type UserReward = {
  numBonusListings: string;
  numBonusOffers: string;
  numListings: string;
  numOffers: string;
  numPurchases: string;
  numSales: string;
  purchasesFeesTotal: string;
  purchasesTotal: string;
  rewardTier: { min: number; max: number; eligible: number; threshold: number };
  salesFeesTotal: string;
  salesTotal: string;

  purchasesFeesTotalNumeric: number;
  purchasesTotalNumeric: number;
  hasAirdrop: boolean;
  openseaVol: number;
  salesFeesTotalNumeric: number;
  salesTotalNumeric: number;
  doneSoFar: number;
  usPerson: 'YES' | 'NO' | 'NONE';
};

// ===========================================================

export type RewardResults = {
  newEligible: number;
  newThreshold: number;
  transacted: number;
  finalEarnedTokens: number;
};

// ===========================================================

export type CollectionCardEntry = {
  address: string;
  bannerImage: string;
  cardImage: string;
  description: string;
  id: string;
  name: string;
  openseaUrl: string;
  hasBlueCheck: boolean;
  title: string; // for <PreviewModal>
  chainId: string;
};

// ===========================================================

export type TransactionCardEntry = {
  txnHash: string;
  createdAt: number;
  actionType: string;
  status: string;
  feesInEth: number;
  salePriceInEth: number;
  chainId: string;
};

// ===========================================================

export interface UnmarshalNFTAsset {
  asset_contract?: string;
  token_id?: string;
  owner?: string;
  external_link?: string;
  type?: string;
  balance?: number;
  nft_metadata?: UnmarhsalNftMetadatum[];
  issuer_specific_data?: UnmarshalIssuerSpecificData;
  price?: string;
  animation_url?: string;
  description?: string;
  traits?: UnmarhsalNftMetadatum[];
}

export interface UnmarshalIssuerSpecificData {
  entire_response?: string;
  image_url?: string;
  name?: string;
}

export interface UnmarhsalNftMetadatum {
  trait_type?: string;
  value?: number | string;
  display_type?: string;
}

// ===========================================================
