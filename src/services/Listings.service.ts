import { CardData } from 'components/Card/Card';
import { Orders, Order } from 'types/Nft.interface';
import { weiToEther } from 'utils/ethersUtil';
import { Filter } from 'components/FilterPanel/FilterPanel';
import { apiGet } from 'utils/apiUtil';

export const getListings = async (listingFilter?: Filter): Promise<CardData[]> => {
  const path = `/listings/`;
  const { result, error }: { result: Orders; error: any } = (await apiGet(path, listingFilter)) as any;
  if (error !== undefined) {
    return [];
  }
  return listingToCardData(result.listings);
};

export const listingToCardData = (listing: Order[]): CardData[] => {
  const cards = listing.map((listingItem, index) => {
    const cardData: CardData = {
      id: listingItem.id,
      image: listingItem.metadata.asset.image,
      title: listingItem.metadata.asset.title,
      inStock: +listingItem.metadata.asset.quantity,
      price: weiToEther(listingItem.basePrice),
      tokenAddress: listingItem.metadata.asset.address,
      tokenId: listingItem.metadata.asset.id,
      maker: listingItem.maker,
      hasBonusReward: listingItem.metadata.hasBonusReward,
      hasBlueCheck: listingItem.metadata.hasBlueCheck,
      collectionName: listingItem.metadata.collectionName,
      owner: listingItem.maker
    };

    return cardData;
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
}
export interface TypeAheadOptions {
  collectionNames: TypeAheadOption[];
  nftNames: TypeAheadOption[];
}
export interface TitleResponse {
  id: string;
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
export const getListingById = async (id: string): Promise<Order | null> => {
  const path = `/listingById/`;
  const { result, error }: { result: Order; error: any } = (await apiGet(path, { id })) as any;
  if (error !== undefined) {
    return null;
  }
  return result;
};
export const getListingsByCollectionName = async (collectionName: string): Promise<Order[] | null> => {
  const path = `/listingsByCollectionName/`;
  const { result, error }: { result: Order[]; error: any } = (await apiGet(path, { collectionName })) as any;
  if (error !== undefined) {
    return null;
  }
  return result;
};

export const getTypeAheadOptions = async (query: TypeaheadQuery): Promise<TypeAheadOptions> => {
  const collectionNames: TypeAheadOption[] = await (await getCollectionNamesOfListings(query)).map((collectionName) => {
    return { name: collectionName, type: 'Collection' };
  });
  const nftNames: TypeAheadOption[] = await (await getTitlesOfListings(query)).map((listing) => {
    return { name: listing.title, type: 'Asset', id: listing.id };
  });
  return { collectionNames, nftNames };
};
export const orderToCardData = (nft: Order): CardData => {
  const cardData: CardData = {
    id: nft?.id,
    image: nft?.metadata?.asset?.image,
    title: nft?.metadata?.asset?.title,
    inStock: +nft?.metadata?.asset?.quantity,
    price: nft?.basePrice ? weiToEther(nft?.basePrice) : undefined
  };
  return cardData;
};
