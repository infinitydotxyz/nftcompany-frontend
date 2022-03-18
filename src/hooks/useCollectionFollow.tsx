import { useEffect, useState } from 'react';
import { apiGet, apiPost } from 'utils/apiUtil';
import { User } from 'utils/context/AppContext';
import { TrendingData } from './useTrendingStats';
import { CollectionFollow } from '@infinityxyz/lib/types/core/Follows';

// ================================================================
// types

export type CollectionFollowHook = {
  list: CollectionFollow[];
  exists: (item?: CollectionFollow) => boolean;
  add: (item: CollectionFollow) => void;
  toggle: (item?: CollectionFollow) => void;
  remove: (item: CollectionFollow) => void;
};

// ================================================================
// useCollectionFollow

export function useCollectionFollow(user: User | null, chainId: string): CollectionFollowHook {
  const [list, setList] = useState<CollectionFollow[]>([]);

  const _update = async () => {
    if (!user || !user?.account) {
      if (list.length > 0) {
        setList([]);
      }
      return;
    }

    const body = {
      limit: 50
    };

    const { result, error } = await apiGet(`/u/${user?.account}/collectionFollows`, body);
    if (error) {
      console.log(`${error.message}`);
      return;
    }

    setList(result ?? []);
  };

  useEffect(() => {
    _update();
  }, [user]);

  const add = (item: CollectionFollow) => {
    if (user) {
      if (!exists(item)) {
        list.push(item);
        setList([...list]);

        addCollectionFollow(user, chainId, item);
      }
    }
  };

  const exists = (item?: CollectionFollow): boolean => {
    if (item) {
      return list.some((e) => {
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
    if (user) {
      const index = list.findIndex((e) => {
        return e.address === item.address;
      });

      if (index !== -1) {
        list.splice(index, 1);

        setList([...list]);

        deleteCollectionFollow(user, chainId, item);
      }
    }
  };

  return { list, exists, add, toggle, remove };
}

// ============================================
// utils

export const trendingDataToCollectionFollow = (trendingData: TrendingData): CollectionFollow => {
  return {
    userAddress: '', // TODO: dylan: set this.
    address: trendingData.collectionAddress ?? '',
    name: trendingData.name ?? '',
    chainId: '1', // TODO: SNG
    slug: 'noidea',
    userAddress: 'fixme'
  };
};

export const deleteCollectionFollow = async (user: User, chainId: string, item: CollectionFollow) => {
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
};

export const addCollectionFollow = async (user: User, chainId: string, item: CollectionFollow) => {
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
};
