import { CardData } from 'infinity-types/types/NftInterface';
import { useEffect, useState } from 'react';
import { ListingSource, SearchFilter, SearchState } from 'utils/context/SearchContext';
import { useAppContext } from 'utils/context/AppContext';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { getListings, TypeAheadOption } from 'services/Listings.service';
import {
  getLastItemBasePrice,
  getLastItemBlueCheck,
  getLastItemCreatedAt,
  getLastItemMaker,
  getLastItemSearchCollectionName,
  getLastItemSearchTitle
} from 'components/FetchMore/FetchMore';

const PAGE_SIZE = ITEMS_PER_PAGE;
// const PAGE_SIZE = 7;

// ==================================================================

const hashString = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const fetchData = async (
  filter: SearchFilter,
  user: string,
  startAfterUser: string,
  startAfterMillis: string,
  startAfterPrice: string,
  startAfterSearchTitle: string,
  startAfterSearchCollectionName: string,
  startAfterBlueCheck: boolean | undefined,
  collectionName: string,
  text: string,
  typeAhead: TypeAheadOption | undefined,
  listingSource: ListingSource,
  chainId: string,
  offset?: number
): Promise<CardData[]> => {
  const result = await getListings({
    ...filter,
    user,
    startAfterUser: user ? startAfterUser : '',
    startAfterMillis,
    startAfterPrice,
    chainId,
    startAfterSearchTitle,
    startAfterSearchCollectionName,
    startAfterBlueCheck,
    limit: PAGE_SIZE.toString(),
    tokenId: typeAhead?.id ?? '',
    tokenAddress: typeAhead?.address ?? '',
    collectionName,
    text,
    priceMax: filter.priceMax,
    offset,
    listingSource
  });

  return result;
};

// ==================================================================

export function useCardProvider(
  listingSource: ListingSource,
  searchContext: {
    searchState: SearchState;
    filterState: SearchFilter;
  },
  inCollectionName?: string
): {
  list: CardData[];
  loadNext: () => void;
  hasData: () => boolean;
  hasLoaded: boolean;
} {
  const [list, setList] = useState<CardData[]>([]);
  const [listType, setListType] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [savedCollectionName, setSavedCollectionName] = useState<string | undefined>();
  const [savedListingSource, setSavedListingSource] = useState<ListingSource | undefined>();
  const [savedSearchContext, setSavedSearchContext] = useState(searchContext);
  const { user, userReady, chainId } = useAppContext();

  useEffect(() => {
    if (searchContext !== savedSearchContext) {
      setSavedSearchContext(searchContext);
    }
  }, [searchContext]);

  const dumpList = () => {
    setSavedCollectionName(inCollectionName);
    setSavedListingSource(listingSource);
    setList([]);
  };

  const collectionNameChanged = savedCollectionName !== inCollectionName;
  const listingSourceChanged = savedListingSource !== listingSource;
  if (collectionNameChanged || listingSourceChanged) {
    dumpList();
  }

  const userAccount = user?.account;

  const fetchList = async (newListType: string, isActiveObj: { isActive: boolean }) => {
    let startAfterUser = '';
    let startAfterMillis = '';
    let startAfterPrice = '';
    let startAfterSearchCollectionName = '';
    let startAfterBlueCheck;
    let startAfterSearchTitle = '';
    let previousList: CardData[] = [];
    let offset = 0;

    // always get a fresh search
    const isTokenIdSearch = newListType.startsWith('token-id');

    // are we getting the next page?
    if (!isTokenIdSearch && listType === newListType && list?.length > 0) {
      previousList = [...list];
      offset = previousList.length;
      startAfterSearchTitle = getLastItemSearchTitle(list);
      startAfterSearchCollectionName = getLastItemSearchCollectionName(list);
      startAfterUser = getLastItemMaker(list);
      startAfterMillis = getLastItemCreatedAt(list);
      startAfterPrice = getLastItemBasePrice(list);
      startAfterBlueCheck = getLastItemBlueCheck(list);
    }

    setListType(newListType);

    const filterState = searchContext.filterState;
    let collectionName = searchContext.searchState.collectionName || searchContext.filterState.collectionName;
    let text = searchContext.searchState.text;
    let selectedOption = searchContext.searchState.selectedOption;

    if (inCollectionName) {
      collectionName = inCollectionName;
      text = '';
      selectedOption = undefined;
    }

    const result = await fetchData(
      filterState,
      userAccount ?? '',
      startAfterUser,
      startAfterMillis,
      startAfterPrice,
      startAfterSearchTitle,
      startAfterSearchCollectionName,
      startAfterBlueCheck,
      collectionName,
      text,
      selectedOption,
      listingSource,
      chainId,
      offset
    );

    if (isActiveObj.isActive) {
      if (result.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      const newList = removeDuplicates([...previousList, ...result]);
      setList(newList);
      setHasLoaded(true);
    }
  };

  const isActiveObj = { isActive: true };
  useEffect(() => {
    const loadData = async () => {
      let hash = searchContext.searchState.collectionName;
      hash += JSON.stringify(searchContext.searchState.text);
      hash += JSON.stringify(searchContext.filterState);
      hash += JSON.stringify(searchContext.searchState.selectedOption);
      hash += JSON.stringify(userAccount);
      hash = hashString(hash).toString();

      if (searchContext.searchState.collectionName) {
        fetchList('collection-name:' + hash, isActiveObj);
      }
      if (searchContext.searchState.text) {
        fetchList('text:' + hash, isActiveObj);
      } else if (searchContext.searchState.selectedOption) {
        fetchList('token-id:' + hash, isActiveObj);
      } else {
        fetchList('normal:' + hash, isActiveObj);
      }
    };

    // avoid flicker, don't do anything until user is set or set to null
    if (userReady) {
      loadData();
    }

    return () => {
      isActiveObj.isActive = false;
    };
  }, [savedSearchContext, userAccount, userReady]);

  const hasData = () => {
    return list.length > 0;
  };

  const removeDuplicates = (srcList: CardData[]): CardData[] => {
    const dupMap = new Map<string, CardData[]>();
    const dupsIds = new Set<string>();
    const replacedIds = new Set<string>();

    const getItemId = (item: { tokenId: string | number; tokenAddress: string }) => {
      return `${item.tokenId}${item.tokenAddress}`;
    };

    for (const item of srcList) {
      const itemId = getItemId(item as any);

      let dupItemArray = dupMap.get(itemId);

      if (!dupItemArray) {
        dupItemArray = [item];
      } else {
        dupItemArray.push(item);

        dupsIds.add(itemId);
      }

      dupMap.set(itemId, dupItemArray);
    }

    let showLowest = true;

    // if this is blank, we also show only the lowest
    // default sort is highest->lowest, so we must check for undefined sortByPrice too
    if (searchContext.filterState.sortByPrice === 'DESC' || !searchContext.filterState.sortByPrice) {
      showLowest = false;
    }

    if (dupsIds.size > 0) {
      const result: CardData[] = [];

      for (const item of srcList) {
        const itemId = getItemId(item as any);

        if (dupsIds.has(itemId)) {
          if (!replacedIds.has(itemId)) {
            replacedIds.add(itemId);
            // find lowest price and add that one
            const choices = dupMap.get(itemId);
            if (choices!.length > 1) {
              let lowestItem = choices![0];
              let minPrice = lowestItem.price ?? 0;
              for (const c of choices!) {
                if (showLowest) {
                  if (c.price! < minPrice) {
                    lowestItem = c;
                    minPrice = c.price ?? 0;
                  }
                } else {
                  if (c.price! > minPrice) {
                    lowestItem = c;
                    minPrice = c.price ?? 0;
                  }
                }
              }
              result.push(lowestItem);
            } else {
              console.log('this should be 2 or more');
            }
          } else {
            // console.log('skipping duplicate');
          }
        } else {
          result.push(item);
        }
      }

      return result;
    }

    return srcList;
  };

  const loadNext = () => {
    if (hasData() && hasMore) {
      fetchList(listType, isActiveObj);
    } else {
      if (!hasData()) {
        console.log('ScrollLoader too early to load next, no data');
      } else {
        console.log('ScrollLoader no more data');
      }
    }
  };

  // don't filter if we search for that name that you might own
  // if (!listType.startsWith('token-id')) {
  //   if (userAccount && list && list.length > 0) {
  //     filteredList = list.filter((item) => {
  //       // opensea lowercases their account strings, so compare to lower
  //       return addressesEqual(item.owner, userAccount);
  //     });
  //   }
  // }

  return { list: list, loadNext, hasData, hasLoaded };
}
