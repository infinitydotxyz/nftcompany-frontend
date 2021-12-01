import { ListingSource, ordersToCardData } from 'services/Listings.service';
import { getLastItemCreatedAt } from 'components/FetchMore/FetchMore';
import { useState, useEffect, useRef } from 'react';
import { CardData } from 'types/Nft.interface';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { apiGet } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';

export function useUserListings(source: ListingSource) {
  const [listings, setListings] = useState<CardData[]>([]);
  const { user, showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchMore, setFetchMore] = useState(1);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const savedSource = useRef(source);

  const getInfinityListings = (address: string) => {
    return apiGet(`/u/${address}/listings`, {
      startAfter: getLastItemCreatedAt(listings),
      limit: ITEMS_PER_PAGE
    });
  };

  const getOpenseaListings = async (address: string) => {
    const offest = listings.length;
    return { result: [], error: undefined };
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
        showAppError(`Failed to fetch listings. ${error?.message}.`);
        return;
      }
      listingData = result?.listings || [];
    } catch (err) {
      console.error(err);
    }

    const moreListings = ordersToCardData(listingData || []);
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
      fetchData(user.account).then((moreListings) => {
        const newListings = moreListings || [];
        if (isActive) {
          setListings((prevListings) => [...prevListings, ...newListings]);
          setIsFetching(false);
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
    }
    return () => {
      isActive = false;
    };
  }, [source, user, fetchMore]);

  return {
    listings,
    isFetching,
    fetchMore: () => setFetchMore((prev) => prev + 1),
    currentPage,
    dataLoaded
  };
}
