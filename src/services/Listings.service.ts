import { CardData, Order, Orders } from 'types/Nft.interface';
import { weiToEther } from 'utils/ethersUtil';
import { apiGet } from 'utils/apiUtil';
import { ListingSource, SearchFilter } from 'utils/context/SearchContext';

export const getListings = async (
  listingFilter?: SearchFilter & { listingSource?: ListingSource }
): Promise<CardData[]> => {
  let path;
  switch (listingFilter?.listingSource) {
    case ListingSource.OpenSea:
      path = '/opensea/listings/';
      break;
    case ListingSource.Infinity:
      path = '/listings/';
      break;
    default:
      path = '/listings/';
  }

  if (listingFilter?.listingSource === ListingSource.OpenSea) {
    const tokenAddress = await getTokenAddress(listingFilter);
    if (!tokenAddress) {
      return [];
    }
    listingFilter.tokenAddress = tokenAddress;
  }

  delete listingFilter?.listingSource;

  const { result, error }: { result: Orders; error: any } = (await apiGet(path, listingFilter)) as any;

  if (error !== undefined) {
    return [];
  }

  return ordersToCardData(result.listings);
};

export const getTokenAddress = async (listingFilter?: SearchFilter): Promise<string> => {
  if (listingFilter?.tokenAddress) {
    return listingFilter.tokenAddress;
  }

  const path = `/collections/${listingFilter?.collectionName}`;

  const { result, error }: { result: any; error: any } = (await apiGet(path)) as any;

  if (error !== undefined) {
    return '';
  }

  if (result.length >= 1 && result[0].address) {
    return result[0].address;
  }

  return '';
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
  address?: string;
}

export const getCollectionNamesOfListings = async (collectionQuery: TypeaheadQuery): Promise<CollectionResponse[]> => {
  const path = `/collections/`;
  const { result, error }: { result: CollectionResponse[]; error: any } = (await apiGet(path, collectionQuery)) as any;
  if (error !== undefined) {
    return [];
  }
  return result;
};

// search by both collection name and listing title (2 api calls)
export const getTypeAheadOptions = async (
  query: TypeaheadQuery,
  searchCollectionsOnly: boolean = false
): Promise<TypeAheadOptions> => {
  if (query?.startsWith) {
    query.startsWith = query.startsWith.replace(/ /g, '');
  }

  const collectionNames: TypeAheadOption[] = (await getCollectionNamesOfListings(query)).map((item) => {
    return { address: item.address, name: item.collectionName, type: 'Collection', hasBlueCheck: item.hasBlueCheck };
  });
  if (searchCollectionsOnly) {
    return { collectionNames, nftNames: [] };
  }

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
    expirationTime: order.expirationTime
  };
  return cardData;
};
