import { BaseCollection } from '@infinityxyz/lib/types/core';
import { apiGet } from 'utils/apiUtil';
import { getSearchFriendlyString } from 'utils/commonUtil';

export type TrendingCollectionResponse = FeaturedCollectionResponse;

export const getTrendingCollections = async (): Promise<TrendingCollectionResponse[]> => {
  /**
   * defaults to featured collections
   */
  return getFeaturedCollections() as Promise<TrendingCollectionResponse[]>;
};

export interface VerifiedCollectionResponse {
  cardImage: string;
  description: string;
  hasBlueCheck: boolean;
  openseaUrl: string;
  bannerImage: string;
  chainId: string;
  profileImage: string;
  address: string;
  name: string;
  searchCollectionName: string;
  chain: string;
  id: string;
}

export const getVerifiedCollections = async (): Promise<VerifiedCollectionResponse[]> => {
  const path = '/featured-collections';

  const { result, error }: { result: { collections: VerifiedCollectionResponse[]; count: number }; error: any } =
    (await apiGet(path)) as any;

  if (error !== undefined) {
    return [];
  }

  return result.collections;
};

export interface FeaturedCollectionResponse {
  bannerImage: string;
  description: string;
  openseaUrl: string;
  cardImage: string;
  address: string;
  name: string;
  id: string;
}

export const getFeaturedCollections = async (): Promise<FeaturedCollectionResponse[]> => {
  const path = '/featured-collections';

  const { result, error }: { result: { collections: FeaturedCollectionResponse[]; count: number }; error: any } =
    (await apiGet(path)) as any;

  if (error !== undefined) {
    return [];
  }

  return result.collections;
};

export const getCollectionInfo = async (
  collectionName: string,
  chainId: string
): Promise<BaseCollection | undefined> => {
  const path = `/collections/${getSearchFriendlyString(collectionName)}`;

  const { result, error }: { result: any; error: any } = (await apiGet(path, { chainId: chainId || '1' })) as any;

  if (error !== undefined) {
    return;
  }

  return result as BaseCollection;
};

export const getAuthenticatedCollectionInfo = async (
  collectionAddress: string,
  userAddress: string,
  chainId?: string
): Promise<CollectionData | undefined> => {
  const path = `/collection/u/${userAddress}/${collectionAddress}`;
  const { result, error }: { result: any; error: any } = (await apiGet(path, { chainId: chainId || '1' })) as any;

  if (error !== undefined) {
    return;
  }

  return result as CollectionData;
};

export const getHistoricalTwitterData = async (collectionAddress: string) => {
  const path = `/collections/${collectionAddress}/twitter`;
  const { result, error }: { result: any; error: any } = (await apiGet(path)) as any;

  if (error !== undefined) {
    return;
  }
  return result as { timestamp: number; followersCount: number }[];
};

export const getHistoricalDiscordData = async (collectionAddress: string) => {
  const path = `/collections/${collectionAddress}/discord`;
  const { result, error }: { result: any; error: any } = (await apiGet(path)) as any;

  if (error !== undefined) {
    return;
  }
  return result as { timestamp: number; presenceCount: number; membersCount: number }[];
};

export type CollectionData = CollectionInfo & { links?: CollectionLinks; stats?: CollectionStats };

export interface CollectionInfo {
  isClaimed?: boolean;

  chain: 'Ethereum' | string;

  searchCollectionName: string;

  description: string;

  bannerImage: string;

  profileImage: string;

  traits: WyvernTraitWithValues[];

  hasBlueCheck: boolean;

  address: string;

  name: string;

  cardImage: string;

  openseaUrl: string;

  chainId: '1' | string;

  benefits?: string[];

  partnerships?: Array<{ name: string; link: string }>;

  twitterSnippet?: TwitterSnippet;

  discordSnippet?: DiscordSnippet;

  metadata?: any; // TODO: use lib types
}

export interface WyvernTraitWithValues {
  trait_type: string;
  trait_count: number;
  display_type?: string;
  values: string[];
  max_value?: any;
}

export interface TwitterSnippet {
  /**
   * time the twitter snippet was last updated
   */
  timestamp: number;

  /**
   * the collection's twitter account
   */
  account?: InfinityTwitterAccount;

  /**
   * recent tweets by verified users mentioning the collection
   */
  recentTweets?: InfinityTweet[];

  /**
   * twitter users with the most followers that have mentioned the collection
   */
  topMentions?: InfinityTwitterAccount[];
}

interface WeeklyData<T> {
  weekEnd: {};
}

interface HistoricalData {
  weekly: [[]];
}

export interface DiscordSnippet {
  /**
   * time the discord snippet was last updated
   */
  timestamp: number;

  /**
   * number of members in the discord
   */
  membersCount: number;

  /**
   * presence (number of active members)
   */
  presenceCount: number;
}

export interface CollectionStats {
  oneDay: {
    volume: number;
    change: number;
    sales: number;
    averagePrice: number;
    discordMembers?: number;
    discordPresence?: number;
    twitterFollowers?: number;
  };
  sevenDay: {
    volume: number;
    change: number;
    sales: number;
    averagePrice: number;
    discordMembers?: number;
    discordPresence?: number;
    twitterFollowers?: number;
  };
  thirtyDay: {
    volume: number;
    change: number;
    sales: number;
    averagePrice: number;
    discordMembers?: number;
    discordPresence?: number;
    twitterFollowers?: number;
  };
  total: {
    volume: number;
    sales: number;
    supply: number;
  };
  count: number;
  owners: number;
  averagePrice: number;
  reports: number;
  marketCap: number;
  floorPrice: number;
  timestamp: number;
  collectionAddress?: string;
  discordMembers?: number;
  discordPresence?: number;
  twitterFollowers?: number;
  votesFor?: number;
  votesAgainst?: number;
  name?: string;
  startAfter?: string;
  profileImage?: string;
  searchCollectionName: string;
}

export interface CollectionLinks {
  timestamp: number;
  twitter?: string;
  discord?: string;
  external?: string;
  medium?: string;
  slug?: string;
  telegram?: string;
  instagram?: string;
  wiki?: string;
  facebook?: string;
}

export interface InfinityTwitterAccount {
  id: string;
  name: string;
  username: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  listedCount: number;
}

export interface InfinityTweet {
  author: InfinityTwitterAccount;
  createdAt: number;
  tweetId: string;
  text: string;
  url: string;
}
