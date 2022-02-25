import { Box, Link } from '@chakra-ui/layout';
import { Button, Image, Progress, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { EthToken } from 'components/Icons/Icons';
import IntervalChange from 'components/IntervalChange/IntervalChange';
import SortButton from 'components/SortButton/SortButton';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import TrendingDrawer from 'components/TrendingSelectionModal/TrendingSelectionDrawer';
import TrendingSelectionModal from 'components/TrendingSelectionModal/TrendingFilter';
import Layout from 'containers/layout';
import { SecondaryOrderBy, StatsFilter, TrendingData, useTrendingStats } from 'hooks/useTrendingStats';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Dispatch, Key, SetStateAction, useEffect, useState } from 'react';
import { OrderBy, OrderDirection, StatInterval } from 'services/Stats.service';
import { numStr, renderSpinner } from 'utils/commonUtil';
import styles from './styles.module.scss';
import { DataColumn, DataColumns, DataColumnType, defaultDataColumns } from 'components/TrendingTable/DataColumns';
import { Period, periodToInterval } from 'components/TrendingTable/TrendingTable';

export default function TrendingList() {
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

  return (
    <Box display="flex" flexDirection={'column'} justifyContent={'flex-start'} marginTop={'80px'}>
      <Box
        display="flex"
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        marginBottom="16px"
      >
        <Box display="flex" flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'}>
          <ToggleTab options={options} selected={period} onChange={onChange} size="sm" />
        </Box>

        <TrendingDrawer dataColumns={dataColumns} setDataColumns={setDataColumns} />
      </Box>

      <TrendingContents statsFilter={statsFilter} dataColumns={dataColumns} setStatsFilter={setStatsFilter} />
    </Box>
  );
}

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

  const valueDiv = (dataColumn: DataColumn, key: string) => {
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
            <Progress
              value={Number.isNaN(value) ? 100 : value}
              variant={Number.isNaN(value) ? 'grey' : 'sentiment'}
              borderRightRadius="8px"
              borderLeftRadius={'8px'}
              marginBottom="12px"
              height="8px"
              width="88px"
            />
            <Text variant="bold">{Number.isNaN(value) ? 'No votes' : `${numStr(Math.floor(value))}% Good`}</Text>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className={styles.row}>
      <TrendingItem trendingData={props.trendingData} image={true} />
      <TrendingItem trendingData={props.trendingData} nameItem={true} />

      {columns.map(([key, dataColumn]) => {
        const content = valueDiv(dataColumn, key);

        let direction = '' as OrderDirection;
        const isSelected = props.statsFilter.secondaryOrderBy === key;
        if (isSelected) {
          direction = props.statsFilter.secondaryOrderDirection;
        }

        return (
          <TrendingItem
            key={key}
            direction={direction}
            title={dataColumn.name}
            trendingData={props.trendingData}
            content={content}
            sortClick={() => {
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
  if (props.nameItem) {
    return (
      <div className={styles.item}>
        <div className={styles.itemValue}>{props.trendingData.name}</div>
      </div>
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
          state={props.direction ?? ''}
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

// eslint-disable-next-line react/display-name
TrendingList.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
