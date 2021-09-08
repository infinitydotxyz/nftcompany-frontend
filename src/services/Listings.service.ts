import { CardData } from 'components/Card/Card';
import { API_BASE } from 'utils/constants';
import axios, { AxiosInstance } from 'axios';
import { Nft } from 'types/Nft.interface';
import { weiToEther } from 'utils/ethersUtil';
import { Filter } from 'components/FilterPanel/FilterPanel';

const axiosApi: AxiosInstance = axios.create({
  headers: {}
});
export const getListings = async (listingFilter?: Filter): Promise<CardData[]> => {
  let url = `${API_BASE}/listings/`;
  if (listingFilter) {
    url = `${url}${getFilterString(listingFilter)}`;
  }
  const response: Nft[] = await (await axiosApi({ url, method: 'GET' })).data;

  const cards = response.map((nft, index) => {
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

export const getFilterString = (listingFilters: Filter): string => {
  let filter = '?';
  if (listingFilters.price) {
    filter = filter + `price=${listingFilters.price}`;
  }
  return filter;
};
