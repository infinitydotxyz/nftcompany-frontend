export type LeaderBoard = {
  count: number;
  results: LeaderBoardEntry[];
};

export type LeaderBoardEntry = {
  numListings: number;
  numPurchases?: number;
  salesFeesTotal?: string;
  numBonusListings: number;
  purchasesFeesTotal?: string;
  salesTotal?: string;
  rewardsInfo: LeaderBoardRewardsInfo;
  purchasesTotal?: string;
  purchasesFeesTotalNumeric?: number;
  purchasesTotalNumeric?: number;
  salesTotalNumeric?: number;
  numSales?: number;
  salesFeesTotalNumeric?: number;
  updatedAt: number;
  id: string;
  profileInfo?: LeaderBoardProfileInfo;
  numBonusOffers?: number;
  numOffers?: number;
};

export type LeaderBoardProfileInfo = {
  email: LeaderBoardEmail;
};

export type LeaderBoardEmail = {
  subscribed?: boolean;
  verificationGuid: string;
  address: string;
};

export type LeaderBoardRewardsInfo = {
  grossReward: string;
  bonusRewardDebt: string;
  rewardDebt: string;
  pending: string;
  purchasePending: string;
  netRewardNumeric: number;
  rewardCalculatedAt: number;
  saleRewardDebt: string;
  bonusPending: string;
  salePending: string;
  purchaseRewardDebt: string;
  grossRewardNumeric: number;
  netReward: string;
};

// ===========================================================

export type UserReward = {
  currentBlock: string;
  totalListings: string;
  totalBonusListings: string;
  totalOffers: string;
  totalBonusOffers: string;
  totalFees: string;
  totalVolume: string;
  totalSales: string;
  reward: string;
  bonusReward: string;
  saleReward: string;
  purchaseReward: string;
  grossReward: string;
  grossRewardNumeric: number;
  penaltyActivated: boolean;
  penaltyRatio: string;
  rewardPerBlock: string;
  bonusRewardPerBlock: string;
  saleRewardPerBlock: string;
  purchaseRewardPerBlock: string;
  numSales: string;
  numPurchases: string;
  salesTotal: string;
  salesFeesTotal: string;
  salesTotalNumeric: number;
  salesFeesTotalNumeric: number;
  purchasesTotal: string;
  purchasesFeesTotal: string;
  totalRewardPaid: string;
  purchasesTotalNumeric: number;
  purchasesFeesTotalNumeric: number;
  numListings: string;
  numBonusListings: string;
  numOffers: string;
  numBonusOffers: string;
  penalty: string;
  netReward: string;
  netRewardNumeric: number;
};
