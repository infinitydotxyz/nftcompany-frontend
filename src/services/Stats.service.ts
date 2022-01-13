import { apiGet } from 'utils/apiUtil';

export enum OrderBy {
  Twitter = 'twitter',
  Discord = 'discord',
  Volume = 'volume',
  AveragePrice = 'averagePrice'
}

export enum StatInterval {
  OneDay = 'oneDay',
  SevenDay = 'sevenDay',
  ThirtyDay = 'thirtyDay',
  Total = 'total'
}

export enum OrderDirection {
  Ascending = 'asc',
  Descending = 'desc'
}

export async function getStats(
  orderBy: OrderBy,
  interval: StatInterval,
  orderDirection: OrderDirection,
  limit: number,
  startAfter: string
) {
  const path = '/collections/stats';

  const { result, error }: { result: any; error: any } = (await apiGet(path, {
    orderBy,
    interval,
    orderDirection,
    limit,
    startAfter
  })) as any;

  if (error !== undefined) {
    return [];
  }

  return result;
}
