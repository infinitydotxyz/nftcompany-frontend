import { Box, Link, Spacer } from '@chakra-ui/layout';
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
import { trendingDataToCollectionFollow, useCollectionFollow, CollectionFollowHook } from 'hooks/useCollectionFollow';
import { useAppContext } from 'utils/context/AppContext';
import { AddIcon, MinusIcon, StarIcon } from '@chakra-ui/icons';

export const TrendingList = (): JSX.Element => {
  const [statsFilter, setStatsFilter] = useState<StatsFilter>({
    primaryOrderBy: OrderBy.Volume,
    primaryOrderDirection: OrderDirection.Descending,
    primaryInterval: StatInterval.OneDay,
    secondaryOrderBy: SecondaryOrderBy.Volume,
    secondaryOrderDirection: OrderDirection.Ascending
  });
  const [dataColumns, setDataColumns] = useState<DataColumns>(defaultDataColumns);
  const { user, chainId } = useAppContext();
  const collectionFollow = useCollectionFollow(user, chainId);
  const {
    options: tOptions,
    onChange: tOnChange,
    selected: tSelected
  } = useToggleTab(['Trending', 'Following'], 'Trending');

  const {
    options,
    onChange,
    selected: period
  } = useToggleTab([Period.OneDay, Period.SevenDays, Period.ThirtyDays, Period.Total], Period.OneDay);

  useEffect(() => {
    const newInterval = periodToInterval[period as Period];

    setStatsFilter((prev) => {
      return {
        ...prev,
        primaryInterval: newInterval
      };
    });
  }, [period]);

  const followingToggle = <ToggleTab options={tOptions} selected={tSelected} onChange={tOnChange} size="sm" />;

  // search = (
  //   <CollectionSearch
  //     onSelect={(collectionAddress) => {
  //       // TODO: SNG
  //       collectionFollow.add({ name: 'fixme', chainId: '1', address: collectionAddress });
  //     }}
  //   />
  // );

  const toolbarAndDrawer = (
    <Box display="flex" flexDirection={'row'} alignItems={'center'} marginBottom="30px">
      <Box display="flex" flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'}>
        <ToggleTab options={options} selected={period} onChange={onChange} size="sm" />
      </Box>

      <Spacer />
      {followingToggle}
      <TrendingDrawer dataColumns={dataColumns} setDataColumns={setDataColumns} />
    </Box>
  );

  return (
    <Box display="flex" flexDirection={'column'} justifyContent={'flex-start'}>
      {toolbarAndDrawer}

      <TrendingContents
        collectionFollow={collectionFollow}
        watchlistMode={tSelected === 'Following'}
        statsFilter={statsFilter}
        dataColumns={dataColumns}
        setStatsFilter={setStatsFilter}
      />
    </Box>
  );
};

// ====================================================================

type Props2 = {
  collectionFollow: CollectionFollowHook;
  statsFilter: StatsFilter;
  dataColumns: DataColumns;
  watchlistMode: boolean;
  setStatsFilter: Dispatch<SetStateAction<StatsFilter>>;
};

export const TrendingContents = ({
  collectionFollow,
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
      return collectionFollow.list.some((j) => {
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
              collectionFollow={collectionFollow}
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

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outline"
          onClick={() => {
            fetchMoreData();
          }}
        >
          More
        </Button>
      </div>
    </>
  );
};

// ====================================================================

type Props3 = {
  collectionFollow: CollectionFollowHook;
  trendingData: TrendingData;
  dataColumns: DataColumns;
  statsFilter: StatsFilter;
  setStatsFilter: Dispatch<SetStateAction<StatsFilter>>;
};

export const TrendingRow = ({
  trendingData,
  collectionFollow,
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
        return <>{value ? <IntervalChange change={value} /> : <Text variant="bold">---</Text>}</>;
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

  const isFavorite = collectionFollow.exists(trendingDataToCollectionFollow(trendingData));
  let favoriteButton = (
    <IconButton
      aria-label=""
      variant="ghost"
      icon={<AddIcon color="#BEBEBE" />}
      isRound
      onClick={() => {
        collectionFollow.toggle(trendingDataToCollectionFollow(trendingData));
      }}
    />
  );

  if (isFavorite) {
    favoriteButton = (
      <IconButton
        aria-label=""
        variant="ghost"
        backgroundColor="#000"
        icon={<MinusIcon color="#fff" />}
        isRound
        onClick={() => {
          collectionFollow.toggle(trendingDataToCollectionFollow(trendingData));
        }}
      />
    );
  }

  // build dynamic grid based on columns shown
  // 60px for image, next is name
  let gridTemplate = '50px minmax(120px, 220px)';

  columns.forEach(([key, item]) => {
    gridTemplate += ` minmax(${item.minWidth}px, ${item.maxWidth}px)`;
  });

  return (
    <div className={styles.row}>
      <div className={styles.gridRow} style={{ gridTemplateColumns: gridTemplate }}>
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

      <div className={styles.starButton}>{favoriteButton}</div>
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
      <div className={styles.item}>
        <Link
          onClick={() => {
            router.push(`/collection/${trendingData.searchCollectionName}`);
          }}
        >
          <div className={styles.itemTitle}>{trendingData.name}</div>
        </Link>
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
