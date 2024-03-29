import { useEffect, useState } from 'react';
import { CollectionStats } from 'services/Collections.service';
import { getStats, OrderBy, OrderDirection, StatInterval } from 'services/Stats.service';

interface IntervalStats {
  sales: number;
  volume: number;
  volumeChange: number;
  averagePrice: number;
  averagePriceChange: number;
  twitterFollowers: number;
  twitterFollowersChange: number;
  discordMembers: number;
  discordMembersChange: number;
  votePercentFor: number;
}

export type TrendingData = IntervalStats &
  Pick<
    CollectionStats,
    | 'collectionAddress'
    | 'name'
    | 'profileImage'
    | 'votesAgainst'
    | 'votesFor'
    | 'floorPrice'
    | 'owners'
    | 'count'
    | 'searchCollectionName'
  >;

export enum SecondaryOrderBy {
  Owners = 'owners',
  Items = 'count',

  FloorPrice = 'floorPrice',
  FloorPriceChange = 'floorPriceChange',
  Volume = 'volume',
  VolumeChange = 'volumeChange',
  Sales = 'sales',
  SalesChange = 'salesChange',
  AveragePrice = 'averagePrice',
  AveragePriceChange = 'averagePriceChange',

  TwitterFollowers = 'twitterFollowers',
  TwitterFollowersChange = 'twitterFollowersChange',
  DiscordMembers = 'discordMembers',
  DiscordMembersChange = 'discordMembersChange',
  DiscordPresence = 'discordPresence',
  DiscordPresenceChange = 'discordPresenceChange',
  VotePercentFor = 'votePercentFor'
}

export interface StatsFilter {
  primaryOrderBy: OrderBy;
  primaryOrderDirection: OrderDirection;
  primaryInterval: StatInterval;
  secondaryOrderBy: SecondaryOrderBy;
  secondaryOrderDirection: OrderDirection;
}

export function useTrendingStats(filter: StatsFilter) {
  // data for all intervals
  const [collectionStats, setCollectionStats] = useState<CollectionStats[]>([]);

  // filter specific data
  const [trendingData, setTrendingData] = useState<TrendingData[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    fetchData(false)
      .then((collectionStats) => {
        if (isActive) {
          setCollectionStats(collectionStats);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [filter.primaryOrderDirection, filter.primaryOrderBy, filter.primaryInterval]);

  const fetchMoreData = async () => {
    setIsLoading(true);
    fetchData(true)
      .then((collectionStats) => {
        setCollectionStats((prev) => {
          const updated = [...prev, ...collectionStats];
          const ids = new Set<string>();

          return updated.filter((item) => {
            if (!item?.collectionAddress || ids.has(item.collectionAddress)) {
              return false;
            } else {
              ids.add(item.collectionAddress);
              return true;
            }
          });
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const sortList = async (): Promise<TrendingData[]> => {
      const selectedIntervalData = getIntervalData(collectionStats, filter.primaryInterval);

      return selectedIntervalData.sort((itemA, itemB) => {
        const itemAField = (itemA as any)[filter.secondaryOrderBy];
        const itemBField = (itemB as any)[filter.secondaryOrderBy];

        // always show NaN fields at the end of the list
        if (
          (Number.isNaN(itemAField) || typeof itemAField !== 'number') &&
          (Number.isNaN(itemBField) || typeof itemBField !== 'number')
        ) {
          return 0;
        } else if (Number.isNaN(itemAField) || typeof itemAField !== 'number') {
          return 1;
        } else if (Number.isNaN(itemBField) || typeof itemBField !== 'number') {
          return -1;
        }

        if (filter.secondaryOrderDirection === OrderDirection.Ascending) {
          return itemBField - itemAField;
        }

        return itemAField - itemBField;
      });
    };

    sortList().then((results) => {
      setTrendingData(results);
    });
  }, [filter.secondaryOrderBy, filter.secondaryOrderDirection, collectionStats]);

  const fetchData = async (fetchMore: boolean) => {
    let startAfter = '';
    if (fetchMore) {
      startAfter = collectionStats[collectionStats.length - 1]?.startAfter ?? '';
    }

    try {
      const collectionStats: CollectionStats[] = await getStats(
        filter.primaryOrderBy,
        filter.primaryInterval,
        filter.primaryOrderDirection,
        50,
        startAfter
      );

      return collectionStats;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getIntervalData = (collectionStats: CollectionStats[], interval: StatInterval): TrendingData[] => {
    const percentChange = (value: number, change: number) => {
      return 100 * (change / value);
    };

    // filtering out items without a collectionAddress, causes key issues on TrendingTable
    // and not sure if they are worth showing anyway
    const filtered = (collectionStats ?? []).filter((item: any) => {
      return item.collectionAddress?.length > 0;
    });

    const trendingData = filtered.map((item: any) => {
      const { collectionAddress, name, profileImage, votesAgainst, votesFor, floorPrice, owners, count } = item;

      const intervalData: any = item[interval];
      const volume = intervalData?.volume;
      const volumeChange = percentChange(volume, intervalData?.change ?? intervalData?.volume);
      const sales = intervalData?.sales;

      const averagePrice = item?.averagePrice;
      const discordMembers = item?.discordMembers;
      const twitterFollowers = item?.twitterFollowers;
      const discordPresence = item?.discordPresence;

      let averagePriceChange = intervalData?.averagePrice;
      let twitterFollowersChange = intervalData?.twitterFollowers;
      let discordMembersChange = intervalData?.discordMembers;
      let discordPresenceChange = intervalData?.discordPresence;

      if (interval === StatInterval.Total) {
        averagePriceChange = averagePrice;
        twitterFollowersChange = twitterFollowers;
        discordMembersChange = discordMembers;
        discordPresenceChange = discordPresence;
      }

      averagePriceChange = percentChange(averagePrice, averagePriceChange);
      twitterFollowersChange = percentChange(twitterFollowers, twitterFollowersChange);
      discordMembersChange = percentChange(discordMembers, discordMembersChange);
      discordPresenceChange = percentChange(discordPresence, discordPresenceChange);

      const votePercentFor = ((item.votesFor ?? 0) / ((item.votesAgainst ?? 0) + (item.votesFor ?? 0))) * 100;

      return {
        collectionAddress,
        name,
        profileImage,
        votesAgainst,
        votesFor,
        floorPrice,
        owners,
        count,
        volume,
        volumeChange,
        sales,
        twitterFollowers,
        twitterFollowersChange,
        discordMembers,
        discordMembersChange,
        averagePrice,
        averagePriceChange,
        votePercentFor,
        searchCollectionName: item.searchCollectionName,
        discordPresence,
        discordPresenceChange
      };
    });

    return trendingData;
  };

  return { trendingData, isLoading, fetchMoreData };
}
