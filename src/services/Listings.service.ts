import { CardData, Order, Orders } from 'types/Nft.interface';
import { weiToEther } from 'utils/ethersUtil';
import { apiGet } from 'utils/apiUtil';
import { SearchFilter } from 'utils/context/SearchContext';

export const getListings = async (listingFilter?: SearchFilter): Promise<CardData[]> => {
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
  hasBlueCheck?: boolean;
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

export interface CollectionResponse {
  collectionName: string;
  hasBlueCheck: boolean;
}

export const getCollectionNamesOfListings = async (collectionQuery: TypeaheadQuery): Promise<CollectionResponse[]> => {
  const path = `/collections/`;
  const { result, error }: { result: CollectionResponse[]; error: any } = (await apiGet(path, collectionQuery)) as any;
  if (error !== undefined) {
    return [];
  }
  return result;
};

export const getTypeAheadOptions = async (query: TypeaheadQuery): Promise<TypeAheadOptions> => {
  if (query?.startsWith) {
    query.startsWith = query.startsWith.replace(/ /g, '');
  }

  const collectionNames: TypeAheadOption[] = (await getCollectionNamesOfListings(query)).map((collectionInfo) => {
    return { name: collectionInfo.collectionName, type: 'Collection', hasBlueCheck: collectionInfo.hasBlueCheck };
  });
  const nftNames: TypeAheadOption[] = (await getTitlesOfListings(query)).map((listing) => {
    return {
      name: listing.title,
      type: 'Asset',
      id: listing.id,
      address: listing.address
    };
  });

  return { collectionNames, nftNames };
};

export const orderToCardData = (order: Order): CardData => {
  const cardData: CardData = {
    id: order.id,
    image: order.metadata.asset.image,
    title: order.metadata.asset.title,
    description: order.metadata.asset.description,
    inStock: +order.metadata.asset.quantity,
    price: weiToEther(order.basePrice || 0),
    tokenAddress: order.metadata.asset.address,
    tokenId: order.metadata.asset.id,
    maker: order.maker,
    order: order,
    hasBonusReward: order.metadata.hasBonusReward,
    hasBlueCheck: order.metadata.hasBlueCheck,
    collectionName: order.metadata.asset.collectionName,
    owner: order.maker,
    metadata: order.metadata,
    schemaName: order.metadata.schema,
    expirationTime: order.expirationTime,
    pageNum: order.metadata.pageNum
  };
  return cardData;
};
