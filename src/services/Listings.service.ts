import { CardData, Order, Orders, OrderType } from 'types/Nft.interface';
import { weiToEther } from 'utils/ethersUtil';
import { apiGet } from 'utils/apiUtil';
import { ListingSource, SearchFilter } from 'utils/context/SearchContext';
import { getSearchFriendlyString } from 'utils/commonUtil';
import { BigNumber } from 'ethers';

export const getListings = async (
  listingFilter: SearchFilter & { listingSource: ListingSource; offset?: string | number }
): Promise<CardData[]> => {
  switch (listingFilter?.listingSource) {
    case ListingSource.Infinity:
      return getInfinityListings(listingFilter);
    default:
      return getInfinityListings(listingFilter);
  }
};

async function getInfinityListings(listingFilter: SearchFilter & { offset?: string | number }): Promise<CardData[]> {
  const path = '/listings/';

  const { result, error }: { result: Orders; error: any } = (await apiGet(path, {
    ...listingFilter,
    ...{ collectionName: getSearchFriendlyString(listingFilter.collectionName || '') }
  })) as any;

  if (error !== undefined) {
    return [];
  }

  return ordersToCardData(result.listings, OrderType.SELL);
}

export const getTokenAddress = async (collectionName: string): Promise<string> => {
  const path = `/collections/${getSearchFriendlyString(collectionName)}`;

  const { result, error }: { result: any; error: any } = (await apiGet(path)) as any;

  if (error !== undefined) {
    return '';
  }

  if (result.length >= 1 && result[0].address) {
    return result[0].address;
  }

  return '';
};

export const ordersToCardData = (listings: Order[], orderType: OrderType): CardData[] => {
  const cards = listings.map((order) => {
    return orderToCardData(order, orderType);
  });
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

export const orderToCardData = (order: Order, orderType: OrderType): CardData => {
  const cheapestOpenseaOrder = getCheapestOpenseaOrder(order);
  let owner = order.maker;
  if (orderType === OrderType.BUY) {
    owner = order.metadata.asset.owner;
  }
  const cardData: CardData = {
    id: order.id,
    image: order.metadata.asset.image,
    title: order.metadata.asset.title,
    description: order.metadata.asset.description,
    inStock: +order.metadata.asset.quantity,
    price: Number(weiToEther(order.basePrice || 0)),
    tokenAddress: order.metadata.asset.address,
    tokenId: order.metadata.asset.id,
    maker: order.maker,
    order: order,
    hasBonusReward: order.metadata.hasBonusReward,
    hasBlueCheck: order.metadata.hasBlueCheck,
    collectionName: order.metadata.asset.collectionName,
    owner,
    metadata: order.metadata,
    schemaName: order.metadata.schema,
    expirationTime: order.expirationTime,
    chainId: order.metadata.chainId,
    openseaListing: cheapestOpenseaOrder
  };
  return cardData;
};

const getCheapestOpenseaOrder = (order: Order) => {
  const sellOrders = (order as any)?.openseaListings;
  const ethSellOrderByOwner = sellOrders?.filter(
    (order: Order & { paymentTokenSymbol: string }) =>
      order?.side === 1 && order?.paymentTokenSymbol === 'ETH' && order?.saleKind === 0
  );
  if (ethSellOrderByOwner?.length > 0) {
    const cheapestSellOrder = ethSellOrderByOwner?.reduce((lowestOrder: Order, currentOrder: Order) => {
      try {
        if (BigNumber.from(currentOrder?.basePrice).lt(BigNumber.from(lowestOrder?.basePrice))) {
          return currentOrder;
        }
      } catch {
      } finally {
        return lowestOrder;
      }
    });

    return cheapestSellOrder;
  }
};
