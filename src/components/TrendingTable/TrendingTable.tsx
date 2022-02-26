import { Box, Link } from '@chakra-ui/layout';
import { Image, Progress, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { EthToken } from 'components/Icons/Icons';
import IntervalChange from 'components/IntervalChange/IntervalChange';
import { SortButton } from 'components/SortButton';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import { TrendingDrawer } from 'components/TrendingSelectionDrawer';
import Layout from 'containers/layout';
import { SecondaryOrderBy, StatsFilter, TrendingData, useTrendingStats } from 'hooks/useTrendingStats';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OrderBy, OrderDirection, StatInterval } from 'services/Stats.service';
import { numStr, renderSpinner } from 'utils/commonUtil';
import { DataColumn, DataColumns, DataColumnType, defaultDataColumns } from '../TrendingList/DataColumns';
import { Period, periodToInterval } from '../TrendingList/PeriodInterval';

export function TrendingTable() {
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
  const router = useRouter();
  const { trendingData, isLoading, fetchMoreData } = useTrendingStats(props.statsFilter);

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

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems="center" maxWidth={'100%'} overflowX={'auto'}>
      <Table variant="unstyled" colorScheme="gray">
        <Thead>
          <Tr>
            <Th paddingBottom={'8px'}>Collection</Th>
            {columns.map(([key, value]) => {
              let direction = '';
              const isSelected = props.statsFilter.secondaryOrderBy === key;
              if (isSelected) {
                direction = props.statsFilter.secondaryOrderDirection;
              }
              return (
                <Th paddingBottom={'8px'} key={key}>
                  <SortButton
                    direction={direction as '' | OrderDirection}
                    onClick={() => {
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
                    label={value.name}
                  />
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {trendingData.map((collectionData: TrendingData) => {
            return (
              <Tr key={collectionData.collectionAddress} borderWidth={20} borderColor={'#fff'} bgColor="#f0f0f0">
                <Td
                  display="flex"
                  flexDirection={['column', 'column', 'column', 'column', 'row']}
                  alignItems={['flex-start', 'flex-start', 'flex-start', 'flex-start', 'center']}
                  justifyContent={['center', 'center', 'center', 'center', 'flex-start']}
                >
                  <Image
                    width="48px"
                    alt={'collection profile image'}
                    src={collectionData.profileImage}
                    marginRight={[0, 0, 0, 0, '16px']}
                    marginBottom={[2, 2, 2, 2, 0]}
                  />
                  <Link
                    onClick={() => {
                      router.push(`/collection/${collectionData.searchCollectionName}`);
                    }}
                  >
                    <Text textAlign={['left', 'left']} maxWidth={'80px'} isTruncated>
                      {collectionData.name}
                    </Text>
                  </Link>
                </Td>
                {columns.map(([key, item]) => {
                  const value: any = (collectionData as any)[key];
                  switch (item.type) {
                    case DataColumnType.Amount:
                      return (
                        <Td key={key}>
                          <Box display="flex" flexDirection={'row'} alignItems={'center'}>
                            {item.unit === 'ETH' && <EthToken marginBottom={'-2px'} />}

                            {value ? <Text variant="bold">{numStr(value)}</Text> : <Text variant="bold">---</Text>}
                          </Box>
                        </Td>
                      );
                    case DataColumnType.Change:
                      return (
                        <Td key={key}>
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
                        </Td>
                      );
                    case DataColumnType.Vote:
                      return (
                        <Td minWidth={'140px'} key={key}>
                          <Progress
                            value={Number.isNaN(value) ? 100 : value}
                            variant={Number.isNaN(value) ? 'grey' : 'sentiment'}
                            borderRightRadius="8px"
                            borderLeftRadius={'8px'}
                            marginBottom="12px"
                            height="8px"
                            width="88px"
                          />
                          <Text variant="bold">
                            {Number.isNaN(value) ? 'No votes' : `${numStr(Math.floor(value))}% Good`}
                          </Text>
                        </Td>
                      );
                    default:
                      return <></>;
                  }
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {isLoading && renderSpinner({ margin: 5 })}
    </Box>
  );
}

// eslint-disable-next-line react/display-name
TrendingTable.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
