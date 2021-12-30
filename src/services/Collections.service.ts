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

export const getCollectionInfo = async (collectionName: string): Promise<CollectionInfo | undefined> => {
  const path = `/collections/${getSearchFriendlyString(collectionName)}`;

  const { result, error }: { result: any; error: any } = (await apiGet(path)) as any;

  if (error !== undefined) {
    return;
  }

  return result as CollectionData;
};

export type CollectionData = CollectionInfo & { links?: CollectionLinks; stats?: CollectionStats };

export interface CollectionInfo {
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
  /**
   * link to the collections twitter
   */
  twitter?: string;
  twitterSnippet?: TwitterSnippet;

  discordSnippet?: DiscordSnippet;
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
  };
  sevenDay: {
    volume: number;
    change: number;
    sales: number;
    averagePrice: number;
  };
  thrityDay: {
    volume: number;
    change: number;
    sales: number;
    averagePrice: number;
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
