import { SecondaryOrderBy } from 'hooks/useTrendingStats';

export enum DataColumnType {
  Vote = 'vote',
  Amount = 'number',
  Change = 'change'
}

export interface DataColumn {
  name: string;
  isDisabled: boolean;
  type: DataColumnType;
  isSelected: boolean;
  unit?: string;
  minWidth: number;
  maxWidth: number;
}

const defaultMinWidth = 40;
const defaultMaxWidth = 140;

export const defaultDataColumns: DataColumns = {
  [SecondaryOrderBy.VotePercentFor]: {
    name: 'Trust',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Vote,
    minWidth: 100,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.AveragePrice]: {
    name: 'Average price',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount,
    unit: 'ETH',
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.AveragePriceChange]: {
    name: 'Average price change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.FloorPrice]: {
    name: 'Floor price',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount,
    unit: 'ETH',
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.FloorPriceChange]: {
    name: 'Change in floor price',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.Sales]: {
    name: 'Sales',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.SalesChange]: {
    name: 'Change in sales',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.Volume]: {
    name: 'Volume',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount,
    unit: 'ETH',
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.VolumeChange]: {
    name: 'Volume change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.DiscordPresence]: {
    name: 'Discord presence',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.DiscordPresenceChange]: {
    name: 'Discord presence change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.DiscordMembers]: {
    name: 'Discord members',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.DiscordMembersChange]: {
    name: 'Discord members change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.TwitterFollowers]: {
    name: 'Twitter followers',
    isSelected: true,
    isDisabled: false,
    type: DataColumnType.Amount,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.TwitterFollowersChange]: {
    name: 'Twitter followers change',
    isDisabled: false,
    isSelected: false,
    type: DataColumnType.Change,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.Items]: {
    name: 'Items',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  },
  [SecondaryOrderBy.Owners]: {
    name: 'Owners',
    isSelected: false,
    isDisabled: false,
    type: DataColumnType.Amount,
    minWidth: defaultMinWidth,
    maxWidth: defaultMaxWidth
  }
};

export type DataColumns = Record<SecondaryOrderBy, DataColumn>;
