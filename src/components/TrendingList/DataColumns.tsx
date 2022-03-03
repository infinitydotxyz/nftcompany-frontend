import { SecondaryOrderBy } from 'hooks/useTrendingStats';

export enum DataColumnType {
  Vote = 'vote',
  Amount = 'number',
  Change = 'change'
}

interface BaseDataColumn {
  name: string;
  isDisabled: boolean;
  type: DataColumnType;
  unit?: string;
}

export interface DataColumn extends BaseDataColumn {
  isSelected: boolean;
}

export const defaultDataColumns: DataColumns = {
  [SecondaryOrderBy.VotePercentFor]: {
    name: 'Trust',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Vote
  },
  [SecondaryOrderBy.AveragePrice]: {
    name: 'Average price',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount,
    unit: 'ETH'
  },
  [SecondaryOrderBy.AveragePriceChange]: {
    name: 'Average price change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change
  },
  [SecondaryOrderBy.FloorPrice]: {
    name: 'Floor price',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount,
    unit: 'ETH'
  },
  [SecondaryOrderBy.FloorPriceChange]: {
    name: 'Change in floor price',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change
  },
  [SecondaryOrderBy.Sales]: {
    name: 'Sales',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount
  },
  [SecondaryOrderBy.SalesChange]: {
    name: 'Change in sales',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change
  },
  [SecondaryOrderBy.Volume]: {
    name: 'Volume',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount,
    unit: 'ETH'
  },
  [SecondaryOrderBy.VolumeChange]: {
    name: 'Volume change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change
  },
  [SecondaryOrderBy.DiscordPresence]: {
    name: 'Discord presence',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount
  },
  [SecondaryOrderBy.DiscordPresenceChange]: {
    name: 'Discord presence change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change
  },
  [SecondaryOrderBy.DiscordMembers]: {
    name: 'Discord members',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount
  },
  [SecondaryOrderBy.DiscordMembersChange]: {
    name: 'Discord members change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change
  },
  [SecondaryOrderBy.TwitterFollowers]: {
    name: 'Twitter followers',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount
  },
  [SecondaryOrderBy.TwitterFollowersChange]: {
    name: 'Twitter followers change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change
  },
  [SecondaryOrderBy.Items]: {
    name: 'Items',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount
  },
  [SecondaryOrderBy.Owners]: {
    name: 'Owners',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount
  }
};

export type DataColumns = Record<SecondaryOrderBy, DataColumn>;
