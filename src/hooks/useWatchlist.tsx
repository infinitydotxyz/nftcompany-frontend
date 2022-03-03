import { useEffect, useState } from 'react';
import { apiGet, apiPost } from 'utils/apiUtil';
import { User } from 'utils/context/AppContext';
import { TrendingData } from './useTrendingStats';

export type WatchListHook = {
  watchlist: CollectionFollow[];
  exists: (item?: CollectionFollow) => boolean;
  add: (item: CollectionFollow) => void;
  toggle: (item?: CollectionFollow) => void;
  remove: (item: CollectionFollow) => void;
};

export type CollectionFollow = {
  address: string;
  chainId: string;
  name: string;
};

export const trendingDataToCollectionFollow = (trendingData: TrendingData): CollectionFollow => {
  return {
    address: trendingData.collectionAddress ?? '',
    name: trendingData.name ?? '',
    chainId: '1' // TODO: SNG
  };
};

export function useWatchlist(user: User | null, chainId: string): WatchListHook {
  const [watchlist, setWatchlist] = useState<CollectionFollow[]>([]);

  const _update = async () => {
    if (!user || !user?.account) {
      if (watchlist.length > 0) {
        setWatchlist([]);
      }
      return;
    }

    const { result, error } = await apiGet(`/u/${user?.account}/collectionFollows`);
    if (error) {
      console.log(`${error.message}`);
      return;
    }

    setWatchlist(result ?? []);
  };

  useEffect(() => {
    _update();
  }, [user]);

  const add = (item: CollectionFollow) => {
    if (!exists(item)) {
      watchlist.push(item);
      setWatchlist([...watchlist]);

      _addFollow(item);
    }
  };

  const exists = (item?: CollectionFollow): boolean => {
    if (item) {
      return watchlist.some((e) => {
        return e.address === item.address;
      });
    }

    return false;
  };

  const toggle = (item?: CollectionFollow) => {
    if (item) {
      if (exists(item)) {
        remove(item);
      } else {
        add(item);
      }
    }
  };

  const remove = (item: CollectionFollow) => {
    const index = watchlist.findIndex((e) => {
      return e.address === item.address;
    });

    if (index !== -1) {
      watchlist.splice(index, 1);

      setWatchlist([...watchlist]);

      _deleteFollow(item);
    }
  };

  const _deleteFollow = async (item: CollectionFollow) => {
    if (user) {
      const response = await apiPost(`/u/${user?.account}/collectionFollows`, null, {
        deleteFollow: true,
        collectionFollow: item,
        chainId: chainId
      });

      if (response.status === 200) {
        console.log(`watchlist updated.`);
      } else {
        console.log('An error occured');
      }
    } else {
      console.log('user not connected');
    }
  };

  const _addFollow = async (item: CollectionFollow) => {
    if (user) {
      const response = await apiPost(`/u/${user?.account}/collectionFollows`, null, {
        deleteFollow: false,
        collectionFollow: item,
        chainId: chainId
      });

      if (response.status === 200) {
        console.log(`watchlist updated.`);
      } else {
        console.log('An error occured');
      }
    } else {
      console.log('user not connected');
    }
  };

  return { watchlist, exists, add, toggle, remove };
}
