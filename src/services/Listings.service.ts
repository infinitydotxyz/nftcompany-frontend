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
