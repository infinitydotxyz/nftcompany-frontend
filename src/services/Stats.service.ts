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
  const body = {
    orderBy,
    interval,
    orderDirection,
    limit,
    startAfter
  };

  const { result, error } = await apiGet('/collections/stats', body);

  if (error !== undefined) {
    return [];
  }

  return result;
}
