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

export type CollectionCardEntry = {
  address: string;
  bannerImage: string;
  cardImage: string;
  description: string;
  id: string;
  name: string;
  openseaUrl: string;
};
