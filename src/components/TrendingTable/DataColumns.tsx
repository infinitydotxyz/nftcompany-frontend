import { SecondaryOrderBy } from 'hooks/useTrendingStats';

export enum DataColumnGroup {
  General = 'General',
  Community = 'Community',
  Transaction = 'Transaction'
}

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
  /**
   * additional columns that will be displayed
   * if this column is selected
   */
  additionalColumns?: [SecondaryOrderBy, BaseDataColumn][];
}

export const defaultDataColumns: DataColumns = {
  [DataColumnGroup.Transaction]: {
    [SecondaryOrderBy.AveragePrice]: {
      name: 'Average price',
      isSelected: false,
      isDisabled: false,
      type: DataColumnType.Amount,
      unit: 'ETH',
      additionalColumns: [
        [
          SecondaryOrderBy.AveragePriceChange,
          {
            name: 'Change in average price',
            isDisabled: false,
            type: DataColumnType.Change
          }
        ]
      ]
    },
    [SecondaryOrderBy.FloorPrice]: {
      name: 'Floor price',
      isSelected: true,
      isDisabled: false,
      type: DataColumnType.Amount,
      unit: 'ETH'
      // additionalColumns: [
      // [
      //   SecondaryOrderBy.FloorPriceChange,
      //   {
      //     name: 'Change in floor price',
      //     isDisabled: false,
      //     type: DataColumnType.Change
      //   }
      // ]
      // ]
    },
    [SecondaryOrderBy.Sales]: {
      name: 'Sales',
      isSelected: false,
      isDisabled: false,
      type: DataColumnType.Amount
      // additionalColumns: [
      //   [
      //     SecondaryOrderBy.SalesChange,
      //     {
      //       name: 'Change in sales',
      //       isDisabled: false,
      //       type: DataColumnType.Change
      //     }
      //   ]
      // ]
    },
    [SecondaryOrderBy.Volume]: {
      name: 'Volume',
      isSelected: true,
      isDisabled: false,
      type: DataColumnType.Amount,
      unit: 'ETH',
      additionalColumns: [
        [
          SecondaryOrderBy.VolumeChange,
          {
            name: 'Change in volume',
            isDisabled: false,
            type: DataColumnType.Change
          }
        ]
      ]
    }
  } as Record<SecondaryOrderBy, DataColumn>,
  [DataColumnGroup.Community]: {
    [SecondaryOrderBy.DiscordPresence]: {
      name: 'Discord presence',
      isSelected: false,
      isDisabled: false,
      type: DataColumnType.Amount,
      additionalColumns: [
        [
          SecondaryOrderBy.DiscordPresenceChange,
          {
            name: 'Change in discord presence',
            isDisabled: false,
            type: DataColumnType.Change
          }
        ]
      ]
    },
    [SecondaryOrderBy.DiscordMembers]: {
      name: 'Discord members',
      isSelected: true,
      isDisabled: false,
      type: DataColumnType.Amount,
      additionalColumns: [
        [
          SecondaryOrderBy.DiscordMembersChange,
          {
            name: 'Change in discord members',
            isDisabled: false,
            type: DataColumnType.Change
          }
        ]
      ]
    },

    [SecondaryOrderBy.TwitterFollowers]: {
      name: 'Twitter followers',
      isSelected: true,
      isDisabled: false,
      type: DataColumnType.Amount,
      additionalColumns: [
        [
          SecondaryOrderBy.TwitterFollowersChange,
          {
            name: 'Change in twitter followers',
            isDisabled: false,
            type: DataColumnType.Change
          }
        ]
      ]
    },
    [SecondaryOrderBy.VotePercentFor]: {
      name: 'Community score',
      isSelected: true,
      isDisabled: false,
      type: DataColumnType.Vote
    }
  } as Record<SecondaryOrderBy, DataColumn>,
  [DataColumnGroup.General]: {
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
  } as Record<SecondaryOrderBy, DataColumn>
};

export type DataColumns = Record<DataColumnGroup, Record<SecondaryOrderBy, DataColumn>>;
