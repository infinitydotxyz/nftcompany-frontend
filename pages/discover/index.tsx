import { Box } from '@chakra-ui/layout';
import { Image, Progress, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from '@chakra-ui/react';
import { useWindowWidth } from '@react-hook/window-size';
import { EthToken } from 'components/Icons/Icons';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import Layout from 'containers/layout';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { numStr, renderSpinner } from 'utils/commonUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';

enum Period {
  Hour
}

interface DiscoverData {
  address: string;
  name: string;
  profileImage: string;
  searchCollectionName: string;
  owners: number;
  twitterFollowers: number;
  twitterFollowersChange: number;
  discordMembers: number;
  discordMemberChange: number;
  votesFor: number;
  votesAgainst: number;
  floorPrice: number;
  floorPriceChange: number;
  volume: number;
  volumeChange: number;
}
export default function Discover() {
  const { options, onChange, selected } = useToggleTab(['1 hr', '12 hrs', '1 day', '7 day', '30 days'], '12 hrs');
  const [isLoading, setIsLoading] = useState(true);

  const tableSize = useBreakpointValue({ base: 'sm', lg: 'md' });

  const [data, setData] = useState<DiscoverData[]>([]);

  const testData: DiscoverData[] = [
    {
      address: '0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9d',
      name: '0n1 Force',
      profileImage:
        'https://lh3.googleusercontent.com/7gOej3SUvqALR-qkqL_ApAt97SpUKQOZQe88p8jPjeiDDcqITesbAdsLcWlsIg8oh7SRrTpUPfPlm12lb4xDahgP2h32pQQYCsuOM_s=s0',

      searchCollectionName: '0n1-force',
      owners: 4200,
      twitterFollowers: 60000,
      twitterFollowersChange: 0.05,
      discordMembers: 30000,
      discordMemberChange: 0.03,
      votesFor: 39,
      votesAgainst: 6,
      floorPrice: 0.81,
      floorPriceChange: 0.03,
      volume: 45700,
      volumeChange: 0.08
    },
    {
      address: '0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9a',
      name: '0n1 Force',
      profileImage:
        'https://lh3.googleusercontent.com/7gOej3SUvqALR-qkqL_ApAt97SpUKQOZQe88p8jPjeiDDcqITesbAdsLcWlsIg8oh7SRrTpUPfPlm12lb4xDahgP2h32pQQYCsuOM_s=s0',

      searchCollectionName: '0n1-force',
      owners: 4200,
      twitterFollowers: 60000,
      twitterFollowersChange: 0.05,
      discordMembers: 30000,
      discordMemberChange: 0.03,
      votesFor: 39,
      votesAgainst: 6,
      floorPrice: 0.81,
      floorPriceChange: 0.03,
      volume: 45700,
      volumeChange: 0.08
    },
    {
      address: '0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9s',
      name: '0n1 Force',
      profileImage:
        'https://lh3.googleusercontent.com/7gOej3SUvqALR-qkqL_ApAt97SpUKQOZQe88p8jPjeiDDcqITesbAdsLcWlsIg8oh7SRrTpUPfPlm12lb4xDahgP2h32pQQYCsuOM_s=s0',

      searchCollectionName: '0n1-force',
      owners: 4200,
      twitterFollowers: 60000,
      twitterFollowersChange: 0.05,
      discordMembers: 30000,
      discordMemberChange: 0.03,
      votesFor: 39,
      votesAgainst: 6,
      floorPrice: 0.81,
      floorPriceChange: 0.03,
      volume: 45700,
      volumeChange: 0.08
    },
    {
      address: '0x3bf2922f4520a8ba0c2efc3d2a1539678dad5e9f',
      name: '0n1 Force',
      profileImage:
        'https://lh3.googleusercontent.com/7gOej3SUvqALR-qkqL_ApAt97SpUKQOZQe88p8jPjeiDDcqITesbAdsLcWlsIg8oh7SRrTpUPfPlm12lb4xDahgP2h32pQQYCsuOM_s=s0',

      searchCollectionName: '0n1-force',
      owners: 4200,
      twitterFollowers: 60000,
      twitterFollowersChange: 0.05,
      discordMembers: 30000,
      discordMemberChange: 0.03,
      votesFor: 39,
      votesAgainst: 6,
      floorPrice: 0.81,
      floorPriceChange: 0.03,
      volume: 45700,
      volumeChange: 0.08
    }
  ];

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
    return new Promise<DiscoverData[]>((resolve) => {
      setTimeout(() => {
        resolve(testData);
      }, 3000);
    });
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
            <ToggleTab options={options} selected={selected} onChange={onChange} size="sm" />
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
                {data.map((item) => {
                  return (
                    <Tr key={item.address}>
                      <Td
                        display="flex"
                        flexDirection={['column', 'column', 'column', 'row']}
                        alignItems="center"
                        justifyContent={['center', 'center', 'center', 'flex-start']}
                      >
                        <Image
                          width="48px"
                          alt={item.name}
                          src={item.profileImage}
                          marginRight={[0, 0, 0, '16px']}
                          marginBottom={[2, 2, 2, 0]}
                        />
                        <Text>{item.name}</Text>
                      </Td>

                      <Td>
                        <Text variant="bold">{numStr(item.twitterFollowers)}</Text>
                      </Td>

                      <Td>
                        <Text variant="bold">{numStr(item.discordMembers)}</Text>
                      </Td>

                      <Td min>
                        <Progress
                          value={(item.votesFor / (item.votesAgainst + item.votesFor)) * 100}
                          variant={'sentiment'}
                          borderRightRadius="8px"
                          borderLeftRadius={'8px'}
                          marginBottom="12px"
                          height="8px"
                          width="88px"
                        />
                        <Text variant="bold">
                          {numStr(Math.floor((item.votesFor / (item.votesAgainst + item.votesFor)) * 100))}% Good
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
