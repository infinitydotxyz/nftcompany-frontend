import { useEffect, useState } from 'react';
import { apiGet, apiPost } from 'utils/apiUtil';
import { User } from 'utils/context/AppContext';

export type WatchListHook = {
  watchlist: string[];
  exists: (item?: string) => boolean;
  add: (item: string) => void;
  toggle: (item?: string) => void;
  save: () => void;
  remove: (item: string) => void;
};

export function useWatchlist(user: User | null): WatchListHook {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const _update = async () => {
    if (!user || !user?.account) {
      if (watchlist.length > 0) {
        setWatchlist([]);
      }
      return;
    }

    const { result, error } = await apiGet(`/u/${user?.account}/watchlist`);
    if (error) {
      console.log(`${error.message}`);
      return;
    }

    setWatchlist(result ?? []);
  };

  useEffect(() => {
    _update();
  }, [user]);

  const add = (item: string) => {
    if (!exists(item)) {
      watchlist.push(item);
      setWatchlist([...watchlist]);
    }
  };

  const exists = (item?: string) => {
    if (item && item.length > 0) {
      return watchlist.indexOf(item) !== -1;
    }

    return false;
  };

  const toggle = (item?: string) => {
    if (item && item.length > 0) {
      if (exists(item)) {
        remove(item);
      } else {
        add(item);
      }

      save();
    }
  };

  const remove = (item: string) => {
    watchlist.splice(watchlist.indexOf(item), 1);

    setWatchlist([...watchlist]);
  };

  const save = async () => {
    if (user) {
      const response = await apiPost(`/u/${user?.account}/watchlist`, null, { watchlist: watchlist });

      if (response.status === 200) {
        console.log(`watchlist updated.`);
      } else {
        console.log('An error occured');
      }
    } else {
      console.log('user not connected');
    }
  };

  return { watchlist, exists, add, toggle, save, remove };
}
