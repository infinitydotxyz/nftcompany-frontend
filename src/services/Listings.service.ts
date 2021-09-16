import { CardData } from 'components/Card/Card';
import { Order, Orders } from 'types/Nft.interface';
import { weiToEther } from 'utils/ethersUtil';
import { Filter } from 'components/FilterPanel/FilterPanel';
import { apiGet } from 'utils/apiUtil';

export const getListings = async (listingFilter?: Filter): Promise<CardData[]> => {
  const path = `/listings/`;
  const { result, error }: { result: Orders; error: any } = (await apiGet(path, listingFilter)) as any;
  if (error !== undefined) {
    return [];
  }
  return ordersToCardData(result.listings);
};

export const ordersToCardData = (listings: Order[]): CardData[] => {
  const cards = listings.map(orderToCardData);
  return cards;
};
export interface TypeaheadQuery {
  startsWith: string;
}
export interface TypeAheadOption {
  type: 'Collection' | 'Asset';
  name: string;
  id?: string;
  address?: string;
}
export interface TypeAheadOptions {
  collectionNames: TypeAheadOption[];
  nftNames: TypeAheadOption[];
}
export interface TitleResponse {
  id: string;
  address: string;
  title: string;
}
export const getTitlesOfListings = async (titleQuery: TypeaheadQuery): Promise<TitleResponse[]> => {
  const path = `/titles/`;
  const { result, error }: { result: TitleResponse[]; error: any } = (await apiGet(path, titleQuery)) as any;
  if (error !== undefined) {
    return [];
  }
  return result;
};

export const getCollectionNamesOfListings = async (collectionQuery: TypeaheadQuery): Promise<string[]> => {
  const path = `/collections/`;
  const { result, error }: { result: string[]; error: any } = (await apiGet(path, collectionQuery)) as any;
  if (error !== undefined) {
    return [];
  }
  return result;
};
export const getListingById = async (id?: string, address?: string): Promise<Order | null> => {
  const path = `/listingById/`;
  const { result, error }: { result: Order; error: any } = (await apiGet(path, { id, address })) as any;
  if (error !== undefined) {
    return null;
  }
  return result;
};
export const getListingsByCollectionName = async (
  collectionName: string,
  listingFilter?: Filter
): Promise<CardData[]> => {
  const path = `/listingsByCollectionName/`;
  const { result, error }: { result: Order[]; error: any } = (await apiGet(path, {
    ...listingFilter,
    collectionName
  })) as any;
  if (error !== undefined) {
    return [];
  }
  return result.map(orderToCardData);
};

export const getTypeAheadOptions = async (query: TypeaheadQuery): Promise<TypeAheadOptions> => {
  const collectionNames: TypeAheadOption[] = (await getCollectionNamesOfListings(query)).map((collectionName) => {
    return { name: collectionName, type: 'Collection' };
  });
  const nftNames: TypeAheadOption[] = (await getTitlesOfListings(query)).map((listing) => {
    return { name: listing.title, type: 'Asset', id: listing.id, address: listing.address };
  });
  return { collectionNames, nftNames };
};
export const orderToCardData = (nft: Order): CardData => {
  const cardData: CardData = {
    id: nft.id,
    image: nft.metadata.asset.image,
    title: nft.metadata.asset.title,
    inStock: +nft.metadata.asset.quantity,
    price: weiToEther(nft.basePrice),
    tokenAddress: nft.metadata.asset.address,
    tokenId: nft.metadata.asset.id,
    maker: nft.maker,
    hasBonusReward: nft.metadata.hasBonusReward,
    hasBlueCheck: nft.metadata.hasBlueCheck,
    collectionName: nft.metadata.asset.collectionName,
    owner: nft.maker
  };
  return cardData;
};
