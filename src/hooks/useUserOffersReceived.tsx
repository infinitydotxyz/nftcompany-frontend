import { ordersToCardData } from 'services/Listings.service';
import { getLastItemBasePrice, getLastItemBlueCheck, getLastItemCreatedAt } from 'components/FetchMore/FetchMore';
import { useState, useEffect } from 'react';
import { CardData, OrderType } from '@infinityxyz/lib/types/core';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { apiGet } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';
import { SearchFilter } from 'utils/context/SearchContext';

export function useUserOffersReceived(filter: SearchFilter | null) {
  const [offers, setOffers] = useState<CardData[]>([]);
  const { user, showAppError, chainId, userReady } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchMore, setFetchMore] = useState(1);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const getOffersReceived = (address: string) => {
    return apiGet(`/u/${address}/offersreceived`, {
      ...filter,
      startAfterMillis: getLastItemCreatedAt(offers),
      startAfterPrice: getLastItemBasePrice(offers),
      startAfterBlueCheck: getLastItemBlueCheck(offers),
      limit: ITEMS_PER_PAGE,
      chainId
    });
  };

  const fetchOffersReceived = async (address: string) => {
    let offersData = [];
    try {
      const { result, error } = await getOffersReceived(address);
      if (error) {
        showAppError(`Failed to fetch received offers. Please relogin.`);
        return;
      }
      offersData = result?.listings || [];
    } catch (err) {
      console.error(err);
    }

    const moreOffers = ordersToCardData(offersData || [], OrderType.BUY);
    return moreOffers;
  };

  const resetOffersReceived = () => {
    setOffers([]);
    setCurrentPage(-1);
  };

  useEffect(() => {
    if (currentPage < 0 || offers.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  const removeDuplicates = (offers: CardData[]) => {
    const ids = new Set();

    return offers.filter((cardData) => {
      const unique = !ids.has(cardData.id);
      ids.add(cardData.id);
      return unique;
    });
  };

  useEffect(() => {
    if (userReady) {
      if (!user?.account) {
        setCurrentPage(-1);
        resetOffersReceived();
      } else {
        setIsFetching(true);
        setDataLoaded(false);
        fetchOffersReceived(user.account).then((newOffers) => {
          setOffers((prevListings) => removeDuplicates([...prevListings, ...(newOffers || [])]));
          setIsFetching(false);
          setCurrentPage((prevPage) => prevPage + 1);
        });
      }
    }
  }, [user, fetchMore, userReady]);

  useEffect(() => {
    resetOffersReceived();
  }, [filter]);

  return {
    offers,
    isFetching,
    fetchMore: () => setFetchMore((prev) => prev + 1),
    currentPage,
    dataLoaded
  };
}
