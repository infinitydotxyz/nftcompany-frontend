import { CardData } from 'components/Card/Card';
import { Orders } from 'types/Nft.interface';
import { weiToEther } from 'utils/ethersUtil';
import { Filter } from 'components/FilterPanel/FilterPanel';
import { apiGet } from 'utils/apiUtil';

export const getListings = async (listingFilter?: Filter): Promise<CardData[]> => {
  const path = `/listings/`;
  const { result, error }: { result: Orders; error: any } = (await apiGet(path, listingFilter)) as any;
  if (error !== undefined) {
    return [];
  }

  const cards = result['listings'].map((nft, index) => {
    const cardData: CardData = {
      id: nft.metadata.asset.id,
      image: nft.metadata.asset.image,
      title: nft.metadata.asset.title,
      inStock: +nft.metadata.asset.quantity,
      price: weiToEther(nft.basePrice)
    };
    return cardData;
  });
  return cards;
};
