import { ordersToCardData } from 'services/Listings.service';
import { getLastItemBasePrice, getLastItemBlueCheck, getLastItemCreatedAt } from 'components/FetchMore/FetchMore';
import { useState, useEffect, useRef } from 'react';
import { CardData, OrderType } from 'types/Nft.interface';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { apiGet } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';
import { ListingSource, SearchFilter } from 'utils/context/SearchContext';

export function useUserListings(source: ListingSource, filter: SearchFilter | null) {
  const [listings, setListings] = useState<CardData[]>([]);
  const { user, showAppError, chainId } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchMore, setFetchMore] = useState(1);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const savedSource = useRef(source);

  const getInfinityListings = (address: string) => {
    return apiGet(`/u/${address}/listings`, {
      ...filter,
      startAfterMillis: getLastItemCreatedAt(listings),
      startAfterPrice: getLastItemBasePrice(listings),
      startAfterBlueCheck: getLastItemBlueCheck(listings),
      limit: ITEMS_PER_PAGE,
      chainId: chainId
    });
  };

  const getOpenseaListings = async (address: string) => {
    const { result, error } = await apiGet('/listings/import', {
      maker: address,
      limit: ITEMS_PER_PAGE,
      side: '1',
      offset: listings.length || 0,
      chainId: chainId
    });
    return {
      error,
      result: {
        count: result?.count,
        listings: result?.orders
      }
    };
  };

  const getListingSource = (source: ListingSource) => {
    switch (source) {
      case ListingSource.Infinity:
        return getInfinityListings;
      case ListingSource.OpenSea:
        return getOpenseaListings;
      default:
        return getInfinityListings;
    }
  };

  const fetchData = async (address: string) => {
    let listingData = [];
    try {
      const getListings = getListingSource(source);
      const { result, error } = await getListings(address);
      if (error) {
        showAppError(`Failed to fetch listings. Please relogin.`);
        return;
      }
      listingData = result?.listings || [];
    } catch (err) {
      console.error(err);
    }

    const moreListings = ordersToCardData(listingData || [], OrderType.SELL);
    return moreListings;
  };

  const resetListings = () => {
    setListings([]);
    setCurrentPage(-1);
  };

  useEffect(() => {
    if (currentPage < 0 || listings.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  const removeDuplicates = (listings: CardData[]) => {
    const ids = new Set();

    return listings.filter((cardData) => {
      const unique = !ids.has(cardData.id);
      ids.add(cardData.id);
      return unique;
    });
  };

  useEffect(() => {
    let isActive = true;
    if (source !== savedSource.current) {
      savedSource.current = source;
      resetListings();
    }

    if (!user?.account) {
      setCurrentPage(-1);
      resetListings();
    } else {
      setIsFetching(true);
      setDataLoaded(false);
      fetchData(user.account).then((newListings) => {
        if (isActive) {
          setListings((prevListings) => removeDuplicates([...prevListings, ...(newListings || [])]));
          setIsFetching(false);
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
    }
    return () => {
      isActive = false;
    };
  }, [source, user, fetchMore]);

  useEffect(() => {
    resetListings();
  }, [filter]);

  return {
    listings,
    isFetching,
    fetchMore: () => setFetchMore((prev) => prev + 1),
    currentPage,
    dataLoaded
  };
}
