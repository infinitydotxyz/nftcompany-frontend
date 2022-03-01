import { Box, Link } from '@chakra-ui/layout';
import { IconButton, Image, Text } from '@chakra-ui/react';
import { EthToken, FavoriteIcon, FavoriteOutlineIcon } from 'components/Icons/Icons';
import IntervalChange from 'components/IntervalChange/IntervalChange';
import { SortButton } from 'components/SortButton';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import { TrendingDrawer } from 'components/TrendingSelectionDrawer';
import { SecondaryOrderBy, StatsFilter, TrendingData, useTrendingStats } from 'hooks/useTrendingStats';
import { useRouter } from 'next/router';
import { Dispatch, Key, SetStateAction, useEffect, useState } from 'react';
import { OrderBy, OrderDirection, StatInterval } from 'services/Stats.service';
import { numStr, renderSpinner } from 'utils/commonUtil';
import styles from './styles.module.scss';
import { DataColumn, DataColumns, DataColumnType, defaultDataColumns } from 'components/TrendingList/DataColumns';
import { Period, periodToInterval } from 'components/TrendingList/PeriodInterval';
import { SortProgressBar } from 'components/SortProgressBar';
import { useWatchlist, WatchListHook } from 'hooks/useWatchlist';
import { useAppContext } from 'utils/context/AppContext';

type Props = {
  watchlistMode?: boolean;
};

export const TrendingList = ({ watchlistMode = false }: Props): JSX.Element => {
  const {
    options,
    onChange,
    selected: period
  } = useToggleTab([Period.OneDay, Period.SevenDays, Period.ThirtyDays, Period.Total], Period.OneDay);

  const [dataColumns, setDataColumns] = useState<DataColumns>(defaultDataColumns);

  const [statsFilter, setStatsFilter] = useState<StatsFilter>({
    primaryOrderBy: OrderBy.Volume,
    primaryOrderDirection: OrderDirection.Descending,
    primaryInterval: StatInterval.OneDay,
    secondaryOrderBy: SecondaryOrderBy.Volume,
    secondaryOrderDirection: OrderDirection.Ascending
  });

  useEffect(() => {
    const newInterval = periodToInterval[period as Period];
    setStatsFilter((prev) => {
      return {
        ...prev,
        primaryInterval: newInterval
      };
    });
  }, [period]);

  const toolbarAndDrawer = (
    <Box
      display="flex"
      flexDirection={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      marginBottom="30px"
    >
      <Box display="flex" flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'}>
        <ToggleTab options={options} selected={period} onChange={onChange} size="sm" />
      </Box>

      <TrendingDrawer dataColumns={dataColumns} setDataColumns={setDataColumns} />
    </Box>
  );

  return (
    <Box display="flex" flexDirection={'column'} justifyContent={'flex-start'}>
      {toolbarAndDrawer}

      <TrendingContents statsFilter={statsFilter} dataColumns={dataColumns} setStatsFilter={setStatsFilter} />
    </Box>
  );
};

// ====================================================================

type Props2 = {
  statsFilter: StatsFilter;
  dataColumns: DataColumns;
  setStatsFilter: Dispatch<SetStateAction<StatsFilter>>;
};

export const TrendingContents = ({ statsFilter, dataColumns, setStatsFilter }: Props2): JSX.Element => {
  const { trendingData, isLoading, fetchMoreData } = useTrendingStats(statsFilter);
  const { user } = useAppContext();
  const watchlist = useWatchlist(user);

  return (
    <div className={styles.list}>
      {trendingData.map((collectionData: TrendingData) => {
        return (
          <TrendingRow
            watchlist={watchlist}
            statsFilter={statsFilter}
            key={collectionData.collectionAddress ?? 'key'}
            trendingData={collectionData}
            dataColumns={dataColumns}
            setStatsFilter={setStatsFilter}
          />
        );
      })}

      {isLoading && renderSpinner({ margin: 5 })}
    </div>
  );
};

// ====================================================================

type Props3 = {
  watchlist: WatchListHook;
  trendingData: TrendingData;
  dataColumns: DataColumns;
  statsFilter: StatsFilter;
  setStatsFilter: Dispatch<SetStateAction<StatsFilter>>;
};

export const TrendingRow = ({
  trendingData,
  watchlist,
  statsFilter,
  dataColumns,
  setStatsFilter
}: Props3): JSX.Element => {
  const [columns, setColumns] = useState<[SecondaryOrderBy, DataColumn][]>([]);

  useEffect(() => {
    const selectedItemsOrderedByGroup: [SecondaryOrderBy, DataColumn][] = Object.values(dataColumns).flatMap((group) =>
      Object.entries(group)
        .filter(([itemKey, item]) => item.isSelected)
        .flatMap(([key, mainColumn]) => {
          return [[key, mainColumn], ...(mainColumn.additionalColumns ?? [])];
        })
    ) as [SecondaryOrderBy, DataColumn][];

    setColumns(selectedItemsOrderedByGroup);
  }, [dataColumns]);

  const onSortClick = (key: SecondaryOrderBy) => {
    const isSelected = statsFilter.secondaryOrderBy === key;

    if (isSelected) {
      setStatsFilter((prev) => {
        return {
          ...prev,
          secondaryOrderDirection:
            prev.secondaryOrderDirection === OrderDirection.Ascending
              ? OrderDirection.Descending
              : OrderDirection.Ascending
        };
      });
    } else {
      setStatsFilter((prev) => {
        return {
          ...prev,
          secondaryOrderBy: key
        };
      });
    }
  };

  const valueDiv = (direction: OrderDirection, dataColumn: DataColumn, key: SecondaryOrderBy) => {
    const value: any = (trendingData as any)[key];

    switch (dataColumn.type) {
      case DataColumnType.Amount:
        return (
          <Box display="flex" flexDirection={'row'} alignItems={'center'}>
            {dataColumn.unit === 'ETH' && <EthToken marginBottom={'-2px'} />}

            {value ? <Text variant="bold">{numStr(value)}</Text> : <Text variant="bold">---</Text>}
          </Box>
        );
      case DataColumnType.Change:
        return (
          <Box display="flex" flexDirection={'row'} alignItems={'center'}>
            {value ? (
              <IntervalChange
                marginLeft={[0, 0, 0, 0, 2]}
                marginTop={[2, 2, 2, 2, 0]}
                change={value}
                justifyContent={'flex-start'}
              />
            ) : (
              <Text variant="bold">---</Text>
            )}
          </Box>
        );
      case DataColumnType.Vote:
        return (
          <>
            <SortProgressBar
              direction={direction}
              percent={value}
              onClick={() => {
                onSortClick(key);
              }}
            />
          </>
        );
      default:
        return <></>;
    }
  };

  const isFavorite = watchlist.exists(trendingData.collectionAddress);
  let favoriteButton = (
    <FavoriteOutlineIcon
      color={'#d00'}
      className={styles.favoritesButton}
      onClick={() => {
        watchlist.toggle(trendingData.collectionAddress);
      }}
    />
  );

  if (isFavorite) {
    favoriteButton = (
      <FavoriteIcon
        color={'#d00'}
        className={styles.favoritesButton}
        onClick={() => {
          watchlist.toggle(trendingData.collectionAddress);
        }}
      />
    );
  }

  return (
    <div className={styles.row}>
      {favoriteButton}

      <div className={styles.partnership}>Partnership</div>
      <TrendingItem trendingData={trendingData} image={true} />
      <TrendingItem trendingData={trendingData} nameItem={true} />

      {columns.map(([key, dataColumn]) => {
        let direction = '' as OrderDirection;
        const isSelected = statsFilter.secondaryOrderBy === key;
        if (isSelected) {
          direction = statsFilter.secondaryOrderDirection;
        }

        const content = valueDiv(direction, dataColumn, key);

        // don't show title on progress bars
        let title;
        if (dataColumn.type !== DataColumnType.Vote) {
          title = dataColumn.name;
        }

        return (
          <TrendingItem
            key={key}
            direction={direction}
            title={title}
            trendingData={trendingData}
            content={content}
            sortClick={() => {
              onSortClick(key);
            }}
          />
        );
      })}
    </div>
  );
};

// ====================================================================

type Props4 = {
  content?: any;
  title?: string;
  trendingData: TrendingData;
  nameItem?: boolean;
  image?: boolean;
  direction?: OrderDirection;
  sortClick?: () => void;
};

export const TrendingItem = ({
  title,
  content,
  image,
  direction,
  sortClick,
  nameItem,
  trendingData
}: Props4): JSX.Element => {
  const router = useRouter();

  if (nameItem) {
    return (
      <Link
        onClick={() => {
          router.push(`/collection/${trendingData.searchCollectionName}`);
        }}
      >
        <div className={styles.item}>
          <div className={styles.itemValue}>{trendingData.name}</div>
        </div>
      </Link>
    );
  }

  if (image) {
    return (
      <div className={styles.item}>
        <div className={styles.imageCropper}>
          <Image alt={'collection image'} src={trendingData.profileImage} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.item}>
      {title && (
        <SortButton
          direction={direction ?? ''}
          onClick={() => {
            if (sortClick) {
              sortClick();
            }
          }}
          label={title}
        />
      )}

      {content}
    </div>
  );
};
