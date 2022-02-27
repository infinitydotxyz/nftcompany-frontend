import { Box, Link } from '@chakra-ui/layout';
import { Image, Text } from '@chakra-ui/react';
import { EthToken } from 'components/Icons/Icons';
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

export const TrendingList = (): JSX.Element => {
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

function TrendingContents(props: {
  statsFilter: StatsFilter;
  dataColumns: DataColumns;
  setStatsFilter: Dispatch<SetStateAction<StatsFilter>>;
}) {
  const { trendingData, isLoading, fetchMoreData } = useTrendingStats(props.statsFilter);

  return (
    <div className={styles.list}>
      {trendingData.map((collectionData: TrendingData) => {
        return (
          <TrendingRow
            statsFilter={props.statsFilter}
            key={collectionData.collectionAddress ?? 'key'}
            trendingData={collectionData}
            dataColumns={props.dataColumns}
            setStatsFilter={props.setStatsFilter}
          />
        );
      })}

      {isLoading && renderSpinner({ margin: 5 })}
    </div>
  );
}

function TrendingRow(props: {
  trendingData: TrendingData;
  dataColumns: DataColumns;
  statsFilter: StatsFilter;
  setStatsFilter: Dispatch<SetStateAction<StatsFilter>>;
}) {
  const [columns, setColumns] = useState<[SecondaryOrderBy, DataColumn][]>([]);

  useEffect(() => {
    const selectedItemsOrderedByGroup: [SecondaryOrderBy, DataColumn][] = Object.values(props.dataColumns).flatMap(
      (group) =>
        Object.entries(group)
          .filter(([itemKey, item]) => item.isSelected)
          .flatMap(([key, mainColumn]) => {
            return [[key, mainColumn], ...(mainColumn.additionalColumns ?? [])];
          })
    ) as [SecondaryOrderBy, DataColumn][];

    setColumns(selectedItemsOrderedByGroup);
  }, [props.dataColumns]);

  const onSortClick = (key: SecondaryOrderBy) => {
    const isSelected = props.statsFilter.secondaryOrderBy === key;

    if (isSelected) {
      props.setStatsFilter((prev) => {
        return {
          ...prev,
          secondaryOrderDirection:
            prev.secondaryOrderDirection === OrderDirection.Ascending
              ? OrderDirection.Descending
              : OrderDirection.Ascending
        };
      });
    } else {
      props.setStatsFilter((prev) => {
        return {
          ...prev,
          secondaryOrderBy: key
        };
      });
    }
  };

  const valueDiv = (direction: OrderDirection, dataColumn: DataColumn, key: SecondaryOrderBy) => {
    const value: any = (props.trendingData as any)[key];

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

  return (
    <div className={styles.row}>
      <div className={styles.partnership}>Partnership</div>
      <TrendingItem trendingData={props.trendingData} image={true} />
      <TrendingItem trendingData={props.trendingData} nameItem={true} />

      {columns.map(([key, dataColumn]) => {
        let direction = '' as OrderDirection;
        const isSelected = props.statsFilter.secondaryOrderBy === key;
        if (isSelected) {
          direction = props.statsFilter.secondaryOrderDirection;
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
            trendingData={props.trendingData}
            content={content}
            sortClick={() => {
              onSortClick(key);
            }}
          />
        );
      })}
    </div>
  );
}

function TrendingItem(props: {
  content?: any;
  title?: string;
  trendingData: TrendingData;
  nameItem?: boolean;
  image?: boolean;
  direction?: OrderDirection;
  sortClick?: () => void;
}) {
  const router = useRouter();

  if (props.nameItem) {
    return (
      <Link
        onClick={() => {
          router.push(`/collection/${props.trendingData.searchCollectionName}`);
        }}
      >
        <div className={styles.item}>
          <div className={styles.itemValue}>{props.trendingData.name}</div>
        </div>
      </Link>
    );
  }

  if (props.image) {
    return (
      <div className={styles.item}>
        <div className={styles.imageCropper}>
          <Image alt={'collection image'} src={props.trendingData.profileImage} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.item}>
      {props.title && (
        <SortButton
          direction={props.direction ?? ''}
          onClick={() => {
            if (props.sortClick) {
              props.sortClick();
            }
          }}
          label={props.title}
        />
      )}

      {props.content}
    </div>
  );
}
