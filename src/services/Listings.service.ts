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

  const cards = result['listings'].map(orderToCardData);
  return cards;
};
export interface TitleQuery {
  startsWith: string;
}
export const getListingsByTitle = async (titleQuery: TitleQuery): Promise<string[]> => {
  const path = `/titles/`;
  const { result, error }: { result: string[]; error: any } = (await apiGet(path, titleQuery)) as any;
  if (error !== undefined) {
    return [];
  }
  return result;
};

export const orderToCardData = (nft: Order) => {
  const cardData: CardData = {
    id: nft?.metadata?.asset?.id,
    image: nft?.metadata?.asset?.image,
    title: nft?.metadata?.asset?.title,
    inStock: +nft?.metadata?.asset?.quantity,
    price: nft?.basePrice ? weiToEther(nft?.basePrice) : undefined
  };
  return cardData;
};
