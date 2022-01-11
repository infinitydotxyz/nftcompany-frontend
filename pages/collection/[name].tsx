import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { NoData } from 'components/FetchMore/FetchMore';
import CardList from 'components/Card/CardList';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { useCardProvider } from 'hooks/useCardProvider';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { useAppContext } from 'utils/context/AppContext';
import { ListingSource, useSearchContext } from 'utils/context/SearchContext';
import { useRouter } from 'next/router';
import { Spacer, Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { NftAction } from 'types';
import {
  CollectionData,
  getCollectionInfo,
  getHistoricalDiscordData,
  getHistoricalTwitterData
} from 'services/Collections.service';
import CollectionOverview from 'components/CollectionOverview/CollectionOverview';
import CollectionStats from 'components/CollectionStats/CollectionStats';
import CollectionLinks from 'components/CollectionLinks/CollectionLinks';
import { renderSpinner } from 'utils/commonUtil';
import InfoGroup from 'components/InfoGroup/InfoGroup';
import CollectionBenefits from 'components/CollectionBenefits.tsx/CollectionBenefits';
import GraphPreview from 'components/GraphPreview/GraphPreview';
import TextToggle from 'components/TextToggle/TextToggle';
import HorizontalLine from 'components/HorizontalLine/HorizontalLine';
import CollectionCommunity from 'components/CollectionCommunity/CollectionCommunity';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import CollectionEvents, { EventType } from 'components/CollectionEvents/CollectionEvents';
import CollectionEventsFilter from 'components/CollectionEventsFilter/CollectionEventsFilter';

const Collection = (): JSX.Element => {
  const [title, setTitle] = useState<string | undefined>();
  const [address, setAddress] = useState('');
  const router = useRouter();
  const { name } = router.query;

  const onEdit = () => {
    router.push(`/collection/edit/${address}`);
  };

  const [collectionInfo, setCollectionInfo] = useState<CollectionData | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const [twitterData, setTwitterData] = useState<{ followersCount: number; timestamp: number }[]>([]);
  const [discordData, setDiscordData] = useState<{ membersCount: number; presenceCount: number; timestamp: number }[]>(
    []
  );

  const [eventFilterState, setEventFilterState] = useState(EventType.Sale);

  const [toggleState, setToggleState] = useState(false);

  useEffect(() => {
    setIsLoading(!collectionInfo);
  }, []);

  useEffect(() => {
    let isActive = true;
    if (address) {
      getHistoricalTwitterData(address)
        .then((data) => {
          if (isActive && data) {
            setTwitterData(data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      getHistoricalDiscordData(address)
        .then((data) => {
          if (isActive && data) {
            setDiscordData(data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setTwitterData([]);
      setDiscordData([]);
    }

    return () => {
      isActive = false;
    };
  }, [address]);

  const CollectionInfoGroupWrapper = (props: { children: React.ReactNode }) => {
    return <Box marginBottom={'32px'}>{props.children}</Box>;
  };

  useEffect(() => {
    let isActive = true;
    const query = address || name;
    if (query && !collectionInfo?.address) {
      setIsLoading(true);
      getCollectionInfo(query as string)
        .then((collectionInfo) => {
          if (isActive && collectionInfo?.address) {
            setCollectionInfo(collectionInfo);
            setIsLoading(false);
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
    return () => {
      isActive = false;
    };
  }, [name, address]);

  return (
    <>
      <Head>
        <title>{title || name}</title>
      </Head>
      <div className="page-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <>
          <Box display={isLoading ? 'flex' : 'none'} justifyContent={'center'} alignItems={'center'} height="400px">
            {isLoading && <div>{renderSpinner()}</div>}
          </Box>

          <Box display={isLoading ? 'none' : 'flex'} flexDirection="column">
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <Box marginRight="32px" flexGrow={4} flexBasis={0}>
                <CollectionOverview
                  collectionName={collectionInfo?.name ?? ''}
                  hasBlueCheck={collectionInfo?.hasBlueCheck ?? false}
                  profileImage={collectionInfo?.profileImage ?? ''}
                  hasBeenClaimed={collectionInfo?.isClaimed ?? false}
                  creator={''}
                  description={collectionInfo?.description}
                  collectionAddress={collectionInfo?.address ?? ''}
                  onClickEdit={onEdit}
                  isClaimed={collectionInfo?.isClaimed ?? false}
                />
              </Box>
              <Spacer />
              <Box flexGrow={3} flexBasis={0}>
                {collectionInfo?.stats && (
                  <CollectionInfoGroupWrapper>
                    <InfoGroup
                      title="Collection Stats"
                      minChildWidth="85px"
                      maxChildWidth="85px"
                      spacing="20px"
                      space="evenly"
                    >
                      <CollectionStats stats={collectionInfo.stats} />
                    </InfoGroup>
                  </CollectionInfoGroupWrapper>
                )}
                {collectionInfo?.benefits && collectionInfo?.benefits?.length > 0 && (
                  <CollectionInfoGroupWrapper>
                    <InfoGroup
                      title="Benfits of holding the NFTs"
                      minChildWidth="100px"
                      maxChildWidth="100px"
                      space="evenly"
                    >
                      <CollectionBenefits benefits={collectionInfo.benefits} />
                    </InfoGroup>
                  </CollectionInfoGroupWrapper>
                )}

                <CollectionInfoGroupWrapper>
                  <InfoGroup title="Follow us" minChildWidth="32px" maxChildWidth="64px" space="start">
                    <CollectionLinks
                      links={collectionInfo?.links ?? {}}
                      onClickEdit={onEdit}
                      isClaimed={collectionInfo?.isClaimed ?? false}
                    />
                  </InfoGroup>
                </CollectionInfoGroupWrapper>

                <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'flex-start'}>
                  <Box marginRight="20px">
                    <GraphPreview
                      label="Twitter followers"
                      changeInterval={24}
                      link={collectionInfo?.links?.twitter}
                      linkText="Follow"
                      data={twitterData.map((item) => {
                        return { ...item, y: item.followersCount };
                      })}
                      dataUnits="followers"
                    />
                  </Box>
                  <GraphPreview
                    label="Discord members"
                    changeInterval={24}
                    link={collectionInfo?.links?.discord}
                    linkText="Join"
                    data={discordData.map((item) => {
                      return { ...item, y: item.membersCount };
                    })}
                    dataUnits="members"
                  />
                </Box>
              </Box>
            </Box>

            <Box marginTop={'72px'} width="min-content">
              <TextToggle
                unCheckedText="NFT"
                checkedText="Community"
                checked={toggleState}
                onClick={() => setToggleState((prev) => !prev)}
              />
            </Box>

            <HorizontalLine display={!toggleState ? 'none' : ''} marginTop={'40px'} />
            {collectionInfo && (
              <CollectionCommunity
                collectionInfo={collectionInfo}
                display={!toggleState ? 'none' : 'flex'}
                onClickEdit={onEdit}
              />
            )}
            <Box className="center" display={toggleState ? 'none' : 'flex'} width="100%">
              <Tabs align={'center'} display={toggleState ? 'none' : ''} width="100%">
                <TabList>
                  <Tab>NFTs</Tab>
                  <Tab isDisabled={!address}>Activity</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box display="flex" flexDirection={'row'} width="100%">
                      <Box width="16%" mr={4} minWidth={'180px'}>
                        <FilterDrawer renderContent={true} showCollection={false} />
                      </Box>
                      <Box width="82%">
                        <CollectionContents
                          name={name as string}
                          onTitle={(newTitle) => {
                            if (!title) {
                              setTitle(newTitle);
                            }
                          }}
                          onLoaded={({ address }) => setAddress(address)}
                          listingSource={ListingSource.Infinity}
                        />
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box display="flex" flexDirection={'row'}>
                      <CollectionEventsFilter
                        filterState={eventFilterState}
                        setFilterState={setEventFilterState}
                        width="16%"
                        mr={4}
                        minWidth={'180px'}
                        paddingBottom="30px"
                        borderBottom="1px solid #ccc"
                      />

                      {address && (
                        <CollectionEvents
                          address={address}
                          eventType={eventFilterState}
                          pageType="collection"
                          width="82%"
                          overflow="hidden"
                        />
                      )}
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
Collection.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Collection;

// =============================================================

type Props = {
  name: string;
  onTitle: (title: string) => void;
  onLoaded?: ({ address }: { address: string }) => void;
  listingSource: ListingSource;
};

const CollectionContents = ({ name, onTitle, onLoaded, listingSource }: Props): JSX.Element => {
  const searchContext = useSearchContext();
  const cardProvider = useCardProvider(listingSource, searchContext, name as string);
  const { user } = useAppContext();

  useEffect(() => {
    if (cardProvider.hasLoaded) {
      if (cardProvider.list.length > 0) {
        const title = cardProvider.list[0].collectionName;
        const tokenAddress = cardProvider.list[0].tokenAddress || '';
        if (onLoaded) {
          onLoaded({ address: tokenAddress });
        }
        if (title) {
          onTitle(title);
        }
      }
    }
  }, [cardProvider]);

  return (
    <>
      <NoData dataLoaded={cardProvider.hasLoaded} isFetching={!cardProvider.hasLoaded} data={cardProvider.list} />

      {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}

      <CardList showItems={['PRICE']} userAccount={user?.account} data={cardProvider.list} action={NftAction.BuyNft} />

      {cardProvider.hasData() && (
        <ScrollLoader
          onFetchMore={async () => {
            cardProvider.loadNext();
          }}
        />
      )}
    </>
  );
};
