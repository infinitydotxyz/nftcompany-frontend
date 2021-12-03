import { apiGet } from 'utils/apiUtil';

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
