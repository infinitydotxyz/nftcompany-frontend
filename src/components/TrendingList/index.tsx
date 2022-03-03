import { Box, Link } from '@chakra-ui/layout';
import { Button, IconButton, Image, Text } from '@chakra-ui/react';
import { EthCurrencyIcon, FavoriteIcon, FavoriteOutlineIcon } from 'components/Icons/Icons';
import IntervalChange from 'components/IntervalChange/IntervalChange';
import { SortButton } from 'components/SortButton';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import { TrendingDrawer } from 'components/TrendingSelectionDrawer';
import { SecondaryOrderBy, StatsFilter, TrendingData, useTrendingStats } from 'hooks/useTrendingStats';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OrderBy, OrderDirection, StatInterval } from 'services/Stats.service';
import { numStr, renderSpinner } from 'utils/commonUtil';
import styles from './styles.module.scss';
import { DataColumn, DataColumns, DataColumnType, defaultDataColumns } from 'components/TrendingList/DataColumns';
import { Period, periodToInterval } from 'components/TrendingList/PeriodInterval';
import { SortProgressBar } from 'components/SortProgressBar';
import { trendingDataToCollectionFollow, useWatchlist, WatchListHook } from 'hooks/useWatchlist';
import { useAppContext } from 'utils/context/AppContext';
import { CollectionSearch } from './CollectionSearch';
import { StarIcon } from '@chakra-ui/icons';

type Props = {
  watchlistMode?: boolean;
};

export const TrendingList = ({ watchlistMode = false }: Props): JSX.Element => {
  const [statsFilter, setStatsFilter] = useState<StatsFilter>({
    primaryOrderBy: OrderBy.Volume,
    primaryOrderDirection: OrderDirection.Descending,
    primaryInterval: StatInterval.OneDay,
    secondaryOrderBy: SecondaryOrderBy.Volume,
    secondaryOrderDirection: OrderDirection.Ascending
  });

  const {
    options,
    onChange,
    selected: period
  } = useToggleTab([Period.OneDay, Period.SevenDays, Period.ThirtyDays, Period.Total], Period.OneDay);
  const [dataColumns, setDataColumns] = useState<DataColumns>(defaultDataColumns);
  const { user, chainId } = useAppContext();
  const watchlist = useWatchlist(user, chainId);

  useEffect(() => {
    const newInterval = periodToInterval[period as Period];
    setStatsFilter((prev) => {
      return {
        ...prev,
        primaryInterval: newInterval
      };
    });
  }, [period]);

  let search;
  if (watchlistMode) {
    search = (
      <CollectionSearch
        onSelect={(collectionAddress) => {
          // TODO: SNG
          watchlist.add({ name: 'fixme', chainId: '1', address: collectionAddress });
        }}
      />
    );
  }

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

      {search}
      <TrendingDrawer dataColumns={dataColumns} setDataColumns={setDataColumns} />
    </Box>
  );

  return (
    <Box display="flex" flexDirection={'column'} justifyContent={'flex-start'}>
      {toolbarAndDrawer}

      <TrendingContents
        watchlist={watchlist}
        watchlistMode={watchlistMode}
        statsFilter={statsFilter}
        dataColumns={dataColumns}
        setStatsFilter={setStatsFilter}
      />
    </Box>
  );
};

// ====================================================================

type Props2 = {
  watchlist: WatchListHook;
  statsFilter: StatsFilter;
  dataColumns: DataColumns;
  watchlistMode: boolean;
  setStatsFilter: Dispatch<SetStateAction<StatsFilter>>;
};

export const TrendingContents = ({
  watchlist,
  watchlistMode,
  statsFilter,
  dataColumns,
  setStatsFilter
}: Props2): JSX.Element => {
  const { trendingData, isLoading, fetchMoreData } = useTrendingStats(statsFilter);

  // get list and filter if watchlistMode
  let collections = trendingData;
  if (watchlistMode) {
    collections = trendingData.filter((e) => {
      return watchlist.watchlist.some((j) => {
        return j.address === e.collectionAddress;
      });
    });
  }

  return (
    <>
      <div className={styles.list}>
        {collections.map((collectionData: TrendingData) => {
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

      <Button
        onClick={() => {
          fetchMoreData();
        }}
      >
        More
      </Button>
    </>
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
    const selectedItemsOrderedByGroup: [SecondaryOrderBy, DataColumn][] = Object.entries(dataColumns).filter(
      ([itemKey, item]) => item.isSelected
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
            {dataColumn.unit === 'ETH' && <EthCurrencyIcon style={{ marginRight: '6px', fontWeight: 'bold' }} />}

            {value ? <div className={styles.itemValue}>{numStr(value)}</div> : <Text variant="bold">---</Text>}
          </Box>
        );
      case DataColumnType.Change:
        return (
          <>
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
          </>
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

  const isFavorite = watchlist.exists(trendingDataToCollectionFollow(trendingData));
  let favoriteButton = (
    <IconButton
      aria-label=""
      variant="ghost"
      icon={<StarIcon color="#BEBEBE" />}
      isRound
      onClick={() => {
        watchlist.toggle(trendingDataToCollectionFollow(trendingData));
      }}
    />
  );

  if (isFavorite) {
    favoriteButton = (
      <IconButton
        aria-label=""
        variant="ghost"
        backgroundColor="#000"
        icon={<StarIcon color="#fff" />}
        isRound
        onClick={() => {
          watchlist.toggle(trendingDataToCollectionFollow(trendingData));
        }}
      />
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.starButton}>{favoriteButton}</div>
      <TrendingItem watchlist={watchlist} trendingData={trendingData} image={true} />
      <TrendingItem watchlist={watchlist} trendingData={trendingData} nameItem={true} />

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
            watchlist={watchlist}
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
  watchlist: WatchListHook;
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
  watchlist,
  nameItem,
  trendingData
}: Props4): JSX.Element => {
  const router = useRouter();

  if (nameItem) {
    return (
      <div className={styles.item}>
        <Link
          onClick={() => {
            router.push(`/collection/${trendingData.searchCollectionName}`);
          }}
        >
          <div className={styles.itemTitle}>{trendingData.name}</div>
        </Link>

        <div className={styles.subtitle}>
          <div className={styles.partnership}>Partnership</div>
        </div>
      </div>
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
