import { CardData } from 'types/Nft.interface';
import { useEffect, useState } from 'react';
import { SearchFilter, useSearchContext } from './useSearch';
import { useAppContext } from 'utils/context/AppContext';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { getListings, TypeAheadOption } from 'services/Listings.service';
import { getLastItemBasePrice, getLastItemCreatedAt, getLastItemMaker } from 'components/FetchMore/FetchMore';

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
  collectionName: string,
  typeAhead: TypeAheadOption | undefined
): Promise<CardData[]> => {
  const result = await getListings({
    ...filter,
    user: user,
    startAfterUser: user ? startAfterUser : '',
    startAfterMillis: startAfterMillis,
    startAfterPrice: startAfterPrice,
    limit: PAGE_SIZE.toString(),
    tokenId: typeAhead?.id ?? '',
    tokenAddress: typeAhead?.address ?? '',
    collectionName: collectionName,
    priceMax: collectionName?.length > 0 ? '1000000' : '' // SNG
  });

  return result;
};

// ==================================================================

export function useCardProvider(): {
  list: CardData[];
  loadNext: () => void;
  hasData: () => boolean;
  hasLoaded: boolean;
} {
  const [list, setList] = useState<CardData[]>([]);
  const [listType, setListType] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const searchContext = useSearchContext();
  const { user, userReady } = useAppContext();

  const userAccount = user?.account;

  const fetchList = async (newListType: string) => {
    let startAfterUser = '';
    let startAfterMillis = '';
    let startAfterPrice = '';
    let previousList: CardData[] = [];

    // always get a fresh search
    const isTokenIdSearch = newListType.startsWith('token-id');

    // are we getting the next page?
    if (!isTokenIdSearch && listType === newListType && list?.length > 0) {
      previousList = list;
      startAfterUser = getLastItemMaker(list);
      startAfterMillis = getLastItemCreatedAt(list);
      startAfterPrice = getLastItemBasePrice(list);
    }

    setListType(newListType);

    const result = await fetchData(
      searchContext.filterState,
      userAccount ?? '',
      startAfterUser,
      startAfterMillis,
      startAfterPrice,
      searchContext.searchState.collectionName,
      searchContext.searchState.selectedOption
    );

    if (result.length < PAGE_SIZE) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setList([...previousList, ...result]);
    setHasLoaded(true);
  };

  useEffect(() => {
    const loadData = async () => {
      let hash = searchContext.searchState.collectionName;
      hash += JSON.stringify(searchContext.filterState);
      hash += JSON.stringify(searchContext.searchState.selectedOption);
      hash += JSON.stringify(userAccount);
      hash = hashString(hash).toString();

      if (searchContext.searchState.collectionName) {
        fetchList('collection-name:' + hash);
      } else if (searchContext.searchState.selectedOption) {
        fetchList('token-id:' + hash);
      } else {
        fetchList('normal:' + hash);
      }
    };

    // avoid flicker, don't do anything until user is set or set to null
    if (userReady) {
      loadData();
    }
  }, [searchContext, userAccount, userReady]);

  const hasData = () => {
    return list.length > 0;
  };

  const removeDuplicates = (srcList: CardData[]): CardData[] => {
    const dupMap = new Map<string, CardData[]>();
    const dupsIds = new Set<string>();
    const replacedIds = new Set<string>();

    for (const item of srcList) {
      const tokenId = item.tokenId;

      // don't think this could be blank, but being safe
      if (tokenId) {
        let a = dupMap.get(tokenId);

        if (!a) {
          a = [item];
        } else {
          a.push(item);

          dupsIds.add(tokenId);
        }

        dupMap.set(tokenId, a);
      } else {
        console.log('no token id?');
      }
    }

    let showLowest = true;
    // if this is blank, we also show only the lowest
    if (searchContext.filterState.sortByPrice === 'DESC') {
      showLowest = false;
    }

    if (dupsIds.size > 0) {
      const result: CardData[] = [];

      for (const item of srcList) {
        if (dupsIds.has(item.tokenId!)) {
          if (!replacedIds.has(item.tokenId!)) {
            replacedIds.add(item.tokenId!);
            // find lowest price and add that one
            const choices = dupMap.get(item.tokenId!);
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
      console.log('loadNext');

      fetchList(listType);
    } else {
      if (!hasData()) {
        console.log('ScrollLoader too early to load next, no data');
      } else {
        console.log('ScrollLoader no more data');
      }
    }
  };

  const filteredList = removeDuplicates(list);

  // don't filter if we search for that name that you might own
  // if (!listType.startsWith('token-id')) {
  //   if (userAccount && list && list.length > 0) {
  //     filteredList = list.filter((item) => {
  //       // opensea lowercases their account strings, so compare to lower
  //       return item.owner?.toLowerCase() !== userAccount.toLowerCase();
  //     });
  //   }
  // }

  return { list: filteredList, loadNext, hasData, hasLoaded };
}
