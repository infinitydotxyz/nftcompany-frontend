import { Box, Link } from '@chakra-ui/layout';
import { Image, Progress, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react';
import { useWindowWidth } from '@react-hook/window-size';
import { EthToken } from 'components/Icons/Icons';
import IntervalChange from 'components/IntervalChange/IntervalChange';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import Layout from 'containers/layout';
import { SecondaryOrderBy, StatsFilter, TrendingData, useTrendingStats } from 'hooks/useTrendingStats';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CollectionStats } from 'services/Collections.service';
import { getStats, OrderBy, OrderDirection, StatInterval } from 'services/Stats.service';
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

export default function Trending() {
  const {
    options,
    onChange,
    selected: period
  } = useToggleTab([Period.OneDay, Period.SevenDays, Period.ThirtyDays, Period.Total], Period.OneDay);

  const [interval, setInterval] = useState(periodToInterval[period as Period]);

  useEffect(() => {
    const newInterval = periodToInterval[period as Period];
    setInterval(newInterval);
  }, [period]);

  const statsFilter = {
    primaryOrderBy: OrderBy.Volume,
    primaryOrderDirection: OrderDirection.Descending,
    primaryInterval: StatInterval.OneDay,
    secondaryOrderBy: SecondaryOrderBy.Owners,
    secondaryOrderDirection: OrderDirection.Descending
  };

  // const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.Volume);
  // const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.Descending);

  // useEffect(() => {
  //   const isActive = true;
  //   setIsLoading(true);
  //   fetchData()
  //     .then((res) => {
  //       if (isActive) {
  //         setData(res);
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

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

          <TrendingContents statsFilter={statsFilter} />
        </Box>
      </div>
    </>
  );
}

function TrendingContents(props: { statsFilter: StatsFilter }) {
  const router = useRouter();
  const tableSize = useBreakpointValue({ base: 'sm', lg: 'md' });
  const { trendingData, isLoading, fetchMoreData } = useTrendingStats(props.statsFilter);

  return (
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
            <Th>Items</Th>
            <Th>Owners</Th>
          </Tr>
        </Thead>
        <Tbody>
          {trendingData.map((item: TrendingData) => {
            return (
              <Tr key={item.collectionAddress}>
                <Td
                  display="flex"
                  flexDirection={['column', 'column', 'column', 'column', 'row']}
                  alignItems={['flex-start', 'flex-start', 'flex-start', 'flex-start', 'center']}
                  justifyContent={['center', 'center', 'center', 'center', 'flex-start']}
                >
                  <Image
                    width="48px"
                    alt={'collection profile image'}
                    src={item.profileImage}
                    marginRight={[0, 0, 0, 0, '16px']}
                    marginBottom={[2, 2, 2, 2, 0]}
                  />
                  <Link
                    onClick={() => {
                      router.push(`/collection/${item.searchCollectionName}`);
                    }}
                  >
                    <Text textAlign={['left', 'left']}>{item.name}</Text>
                  </Link>
                </Td>
                <Td>
                  <Box display="flex" flexDirection={['column', 'column', 'column', 'column', 'row']}>
                    {item.twitterFollowers ? (
                      <>
                        <Text variant="bold">{numStr(item.twitterFollowers)}</Text>
                        <IntervalChange
                          marginLeft={[0, 0, 0, 0, 2]}
                          marginTop={[2, 2, 2, 2, 0]}
                          change={item.twitterFollowersChange}
                          interval={24}
                          intervalUnits={'hrs'}
                          justifyContent={'flex-start'}
                        />
                      </>
                    ) : (
                      <Text variant="bold">---</Text>
                    )}
                  </Box>
                </Td>

                <Td>
                  <Box display="flex" flexDirection={['column', 'column', 'column', 'column', 'row']}>
                    {item.discordMembers ? (
                      <>
                        <Text variant="bold">{numStr(item.discordMembers)}</Text>
                        <IntervalChange
                          change={item.discordMembersChange}
                          marginLeft={[0, 0, 0, 0, 2]}
                          marginTop={[2, 2, 2, 2, 0]}
                          interval={24}
                          intervalUnits={'hrs'}
                          justifyContent={'flex-start'}
                        />
                      </>
                    ) : (
                      <Text variant="bold">---</Text>
                    )}
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
                  <Text variant="bold">{numStr(item.count)}</Text>
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
  );
}

// eslint-disable-next-line react/display-name
Trending.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
