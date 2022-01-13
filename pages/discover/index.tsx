import { Box } from '@chakra-ui/layout';
import { Image, Progress, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react';
import { useWindowWidth } from '@react-hook/window-size';
import { EthToken } from 'components/Icons/Icons';
import IntervalChange from 'components/IntervalChange/IntervalChange';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import Layout from 'containers/layout';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CollectionStats } from 'services/Collections.service';
import { getStats, OrderDirection, StatInterval } from 'services/Stats.service';
import { numStr, renderSpinner } from 'utils/commonUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';

enum Period {
  OneDay = '1 day',
  SevenDays = '7 days',
  ThirtyDays = '30 days',
  Total = 'Total'
}

enum OrderBy {
  Twitter = 'twitter',
  Discord = 'discord',
  Volume = 'volume'
  // AveragePrice = 'averagePrice'
}

const periodToInterval: Record<Period, StatInterval> = {
  [Period.OneDay]: StatInterval.OneDay,
  [Period.SevenDays]: StatInterval.SevenDay,
  [Period.ThirtyDays]: StatInterval.ThirtyDay,
  [Period.Total]: StatInterval.Total
};

interface IntervalStats {
  sales: number;
  volume: number;
  volumeChange: number;
  averagePrice: number;
  averagePriceChange: number;
  twitterFollowers: number;
  twitterFollowersChange: number;
  discordMembers: number;
  discordMembersChange: number;
  votePercentFor: number;
}

type DiscoverData = IntervalStats &
  Pick<
    CollectionStats,
    'collectionAddress' | 'name' | 'profileImage' | 'votesAgainst' | 'votesFor' | 'floorPrice' | 'owners' | 'count'
  >;

export default function Discover() {
  const {
    options,
    onChange,
    selected: period
  } = useToggleTab([Period.OneDay, Period.SevenDays, Period.ThirtyDays, Period.Total], Period.OneDay);
  const [isLoading, setIsLoading] = useState(true);

  const tableSize = useBreakpointValue({ base: 'sm', lg: 'md' });

  const [data, setData] = useState<DiscoverData[]>([]);

  const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.Volume);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.Descending);

  useEffect(() => {
    const isActive = true;
    setIsLoading(true);
    fetchData()
      .then((res) => {
        if (isActive) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const fetchData = async () => {
    const interval: StatInterval = periodToInterval[period as Period];
    try {
      const collectionStats: CollectionStats[] = await getStats(orderBy, interval, orderDirection, 50, '');

      const discoverData = (collectionStats ?? []).map((item: any) => {
        const { collectionAddress, name, profileImage, votesAgainst, votesFor, floorPrice, owners, count } = item;

        const intervalData: any = item[interval as string];
        const volume = intervalData?.volume;
        const volumeChange = intervalData?.change ?? 0;
        const sales = intervalData?.sales;

        const averagePrice = item?.averagePrice;
        const discordMembers = item?.discordMembers;
        const twitterFollowers = item?.twitterFollowers;

        let averagePriceChange = intervalData?.averagePrice;
        let twitterFollowersChange = intervalData?.twitterFollowers;
        let discordMembersChange = intervalData?.discordMembers;
        if (interval === StatInterval.Total) {
          averagePriceChange = averagePrice;
          twitterFollowersChange = twitterFollowers;
          discordMembersChange = discordMembers;
        }

        const votePercentFor = ((item.votesFor ?? 0) / ((item.votesAgainst ?? 0) + (item.votesFor ?? 0))) * 100;

        return {
          collectionAddress,
          name,
          profileImage,
          votesAgainst,
          votesFor,
          floorPrice,
          owners,
          count,
          volume,
          volumeChange,
          sales,
          twitterFollowers,
          twitterFollowersChange,
          discordMembers,
          discordMembersChange,
          averagePrice,
          averagePriceChange,
          votePercentFor
        };
      });

      console.log(discoverData);
      return discoverData;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>

      <div className="page-container">
        <Box display="flex" flexDirection={'column'} justifyContent={'flex-start'} marginTop={'80px'}>
          <Box
            display="flex"
            flexDirection={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            marginBottom="16px"
          >
            <Text size="lg" paddingBottom={'4px'}>
              Period:
            </Text>
            <ToggleTab options={options} selected={period} onChange={onChange} size="sm" />
          </Box>

          <Box
            border="1px solid"
            borderRadius={'8px'}
            borderColor="separator"
            display={'flex'}
            flexDirection={'column'}
            alignItems="center"
            minWidth={'680px'}
          >
            <Table colorScheme="gray" marginTop={4} size={tableSize}>
              <Thead>
                <Tr>
                  <Th>Collection</Th>
                  <Th>Twitter followers</Th>
                  <Th>Discord members</Th>
                  <Th>Trust score</Th>
                  <Th>Floor price</Th>
                  <Th>Volume</Th>
                  <Th>Owners</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item: DiscoverData) => {
                  return (
                    <Tr key={item.collectionAddress}>
                      <Td
                        display="flex"
                        flexDirection={['column', 'column', 'column', 'column', 'row']}
                        alignItems="center"
                        justifyContent={['center', 'center', 'center', 'center', 'flex-start']}
                      >
                        <Image
                          width="48px"
                          alt={'collection profile image'}
                          src={item.profileImage}
                          marginRight={[0, 0, 0, 0, '16px']}
                          marginBottom={[2, 2, 2, 2, 0]}
                        />
                        <Text textAlign={['center', 'center', 'center', 'left']}>{item.name}</Text>
                      </Td>
                      <Td>
                        <Box display="flex" flexDirection={['column', 'column', 'column', 'row']}>
                          <Text variant="bold">{numStr(item.twitterFollowers)}</Text>
                          <IntervalChange
                            marginLeft={[0, 0, 0, 2]}
                            marginTop={[2, 2, 2, 0]}
                            change={item.twitterFollowersChange}
                            interval={24}
                            intervalUnits={'hrs'}
                            justifyContent={'flex-start'}
                          />
                        </Box>
                      </Td>

                      <Td>
                        <Box display="flex" flexDirection={['column', 'column', 'column', 'row']}>
                          <Text variant="bold">{numStr(item.discordMembers)}</Text>
                          <IntervalChange
                            change={item.discordMembersChange}
                            marginTop={[2, 2, 2, 0]}
                            marginLeft={[0, 0, 0, 2]}
                            interval={24}
                            intervalUnits={'hrs'}
                            justifyContent={'flex-start'}
                          />
                        </Box>
                      </Td>

                      <Td minWidth={'140px'}>
                        <Progress
                          value={Number.isNaN(item.votePercentFor) ? 100 : item.votePercentFor}
                          variant={Number.isNaN(item.votePercentFor) ? 'grey' : 'sentiment'}
                          borderRightRadius="8px"
                          borderLeftRadius={'8px'}
                          marginBottom="12px"
                          height="8px"
                          width="88px"
                        />
                        <Text variant="bold">
                          {Number.isNaN(item.votePercentFor)
                            ? 'No votes'
                            : `${numStr(Math.floor(item.votePercentFor))}% Good`}
                        </Text>
                      </Td>

                      <Td>
                        <Box display="flex" flexDirection={'row'} alignItems={'center'}>
                          <EthToken marginBottom={'-2px'} />
                          <Text variant="bold">{numStr(item.floorPrice)}</Text>
                        </Box>
                      </Td>

                      <Td>
                        <Box display="flex" flexDirection={'row'} alignItems={'center'}>
                          <EthToken marginBottom={'-2px'} />
                          <Text variant="bold">{numStr(item.volume)}</Text>
                        </Box>
                      </Td>

                      <Td>
                        <Text variant="bold">{numStr(item.owners)}</Text>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            {isLoading && renderSpinner({ margin: 5 })}
          </Box>
        </Box>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Discover.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
