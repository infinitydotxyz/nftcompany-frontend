import { useEffect, useState } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // setWatchlist([]);
  }, []);

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
    }
  };

  const remove = (item: string) => {
    watchlist.splice(watchlist.indexOf(item), 1);

    setWatchlist([...watchlist]);
  };

  const save = () => {
    // watchList.push(item);
  };

  return { watchlist, isLoading, exists, add, toggle, save, remove };
}
