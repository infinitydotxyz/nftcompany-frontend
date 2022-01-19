import { Box, Link } from '@chakra-ui/layout';
import {
  Button,
  IconButton,
  Image,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react';
import { EthToken } from 'components/Icons/Icons';
import IntervalChange from 'components/IntervalChange/IntervalChange';
import SortButton from 'components/SortButton/SortButton';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import TrendingSelectionModal from 'components/TrendingSelectionModal/TrendingSelectionModal';
import Layout from 'containers/layout';
import { SecondaryOrderBy, StatsFilter, TrendingData, useTrendingStats } from 'hooks/useTrendingStats';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OrderBy, OrderDirection, StatInterval } from 'services/Stats.service';
import { numStr, renderSpinner } from 'utils/commonUtil';

enum Period {
  OneDay = '1 day',
  SevenDays = '7 days',
  ThirtyDays = '30 days',
  Total = 'Total'
}

const periodToInterval: Record<Period, StatInterval> = {
  [Period.OneDay]: StatInterval.OneDay,
  [Period.SevenDays]: StatInterval.SevenDay,
  [Period.ThirtyDays]: StatInterval.ThirtyDay,
  [Period.Total]: StatInterval.Total
};

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

const defaultDataColumns: DataColumns = {
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
      type: DataColumnType.Amount,
      additionalColumns: [
        [
          SecondaryOrderBy.SalesChange,
          {
            name: 'Change in sales',
            isDisabled: false,
            type: DataColumnType.Change
          }
        ]
      ]
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

export default function Trending() {
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>

      <div className="page-container">
        <Box display="flex" flexDirection={'column'} justifyContent={'flex-start'} marginTop={'80px'}>
          {isOpen && (
            <TrendingSelectionModal
              isOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
              dataColumns={dataColumns}
              setDataColumns={setDataColumns}
            />
          )}
          <Box
            display="flex"
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            marginBottom="16px"
          >
            <Box display="flex" flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'}>
              <Text size="lg" paddingBottom={'4px'}>
                Period:
              </Text>
              <ToggleTab options={options} selected={period} onChange={onChange} size="sm" />
            </Box>
            <Button variant="outline" size="sm" onClick={onOpen}>
              Select Categories
            </Button>
          </Box>

          <TrendingContents statsFilter={statsFilter} dataColumns={dataColumns} setStatsFilter={setStatsFilter} />
        </Box>
      </div>
    </>
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
    <Box
      border="1px solid"
      borderRadius={'8px'}
      borderColor="separator"
      display={'flex'}
      flexDirection={'column'}
      alignItems="center"
      maxWidth={'100%'}
      overflowX={'auto'}
    >
      <Table colorScheme="gray" marginTop={4} size={'sm'} display={'block'}>
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
                    state={direction as '' | OrderDirection}
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
              <Tr key={collectionData.collectionAddress}>
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
                                change={`${numStr(Math.abs(value))}%`}
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
Trending.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
