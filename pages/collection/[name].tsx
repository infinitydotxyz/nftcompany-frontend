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
import HorizontalLine from 'components/HorizontalLine/HorizontalLine';
import CollectionCommunity from 'components/CollectionCommunity/CollectionCommunity';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import CollectionEvents, { EventType } from 'components/CollectionEvents/CollectionEvents';
import CollectionEventsFilter from 'components/CollectionEventsFilter/CollectionEventsFilter';
import ToggleTab, { useToggleTab } from 'components/ToggleTab/ToggleTab';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import styles from './Collection.module.scss';
import { PAGE_NAMES } from 'utils/constants';

enum CollectionTabs {
  NFTs = 'NFTs',
  Community = 'Community'
}

const Collection = (): JSX.Element => {
  const { chainId, showAppError } = useAppContext();
  const [title, setTitle] = useState<string | undefined>();
  const [address, setAddress] = useState('');
  const router = useRouter();
  const { name } = router.query;
  const searchContext = useSearchContext();
  const [tabIndex, setTabIndex] = useState(0);

  const onEdit = () => {
    if (!address) {
      showAppError('Invalid url, please try reloading the page');
    } else {
      router.push(`/collection/edit/${address}`);
    }
  };

  const { options, onChange, selected } = useToggleTab(
    [CollectionTabs.NFTs, CollectionTabs.Community],
    CollectionTabs.NFTs
  );

  const [collectionInfo, setCollectionInfo] = useState<CollectionData | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isCardsLoading, setIsCardsLoading] = useState(true);

  const [twitterData, setTwitterData] = useState<{ followersCount: number; timestamp: number }[]>([]);
  const [discordData, setDiscordData] = useState<{ membersCount: number; presenceCount: number; timestamp: number }[]>(
    []
  );

  const [eventFilterState, setEventFilterState] = useState(EventType.Sale);

  const [toggleTab, setToggleTab] = useState<'NFTs' | 'Community'>('NFTs');

  useEffect(() => {
    setIsLoading(!collectionInfo);
  }, []);

  useEffect(() => {
    if (collectionInfo?.address && collectionInfo?.address !== address) {
      setAddress(collectionInfo.address.toLowerCase());
    }
  }, [collectionInfo]);

  const onLoaded = (addressFromListings: string) => {
    if (addressFromListings && addressFromListings !== address) {
      setAddress(addressFromListings.toLowerCase());
    }
    setIsCardsLoading(false);
  };

  useEffect(() => {
    /**
     * there is a discrepancy between the searchCollectionName
     * for listings/assets and collections.
     *
     * all navigation to this page should come from clicking on an listing or asset
     * so we first attempt to load the collection info using the searchCollectionName from
     * the url
     * if the listings load and we get the address, then we try again using
     * that address
     * if neither load in 4 seconds we throw an error and display that the
     * collection was not found
     */
    let isActive = true;

    if (address && !collectionInfo?.address) {
      setIsLoading(true);
      getCollectionInfo(address as string, chainId)
        .then((collectionInfo) => {
          if (isActive && collectionInfo?.address) {
            setCollectionInfo(collectionInfo);
          }
          if (isActive) {
            setIsLoading(false);
          }
        })
        .catch((err: any) => {
          console.error(err);
          if (isActive) {
            setIsLoading(false);
          }
        });
    } else if (name && !collectionInfo?.address) {
      setIsLoading(true);
      getCollectionInfo(name as string, chainId)
        .then((collectionInfo) => {
          if (isActive && collectionInfo?.address) {
            setCollectionInfo(collectionInfo);
            setIsLoading(false);
          } else if (isActive) {
            setIsLoading(isCardsLoading);
          }
        })
        .catch((err: any) => {
          console.error(err);
          if (isActive) {
            setIsLoading(isCardsLoading);
          }
        });
    }
    return () => {
      isActive = false;
    };
  }, [name, address, isCardsLoading]);

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
                {typeof collectionInfo?.stats?.floorPrice === 'number' && (
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
                    {collectionInfo?.links?.twitter ? (
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
                    ) : (
                      <GraphPreview
                        label="Twitter followers"
                        changeInterval={24}
                        onClick={onEdit}
                        buttonText="Add Twitter"
                        data={twitterData.map((item) => {
                          return { ...item, y: item.followersCount };
                        })}
                        dataUnits="followers"
                      />
                    )}
                  </Box>
                  {collectionInfo?.links?.discord ? (
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
                  ) : (
                    <GraphPreview
                      label="Discord members"
                      changeInterval={24}
                      onClick={onEdit}
                      buttonText="Add Discord"
                      data={discordData.map((item) => {
                        return { ...item, y: item.membersCount };
                      })}
                      dataUnits="members"
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Box
              marginTop={'72px'}
              display={'flex'}
              flexDirection="row"
              width="100%"
              alignItems={'center'}
              className={styles.toggle}
            >
              <ToggleTab
                options={['NFTs', 'Community']}
                selected={toggleTab}
                onChange={(opt: string) => setToggleTab(opt as any)}
              />

              {toggleTab === 'NFTs' && (
                <>
                  <Spacer />
                  <SortMenuButton
                    disabled={tabIndex === 1}
                    setFilterState={searchContext.setFilterState}
                    filterState={searchContext.filterState}
                  />
                </>
              )}
            </Box>

            <HorizontalLine display={toggleTab === 'NFTs' ? 'none' : ''} marginTop={'40px'} />
            {collectionInfo && (
              <CollectionCommunity
                collectionInfo={collectionInfo}
                display={toggleTab === 'NFTs' ? 'none' : 'flex'}
                onClickEdit={onEdit}
              />
            )}
            <Box className="center" display={toggleTab === 'Community' ? 'none' : 'flex'} width="100%">
              <Tabs
                align={'center'}
                display={toggleTab === 'Community' ? 'none' : ''}
                width="100%"
                index={tabIndex}
                onChange={(index) => setTabIndex(index)}
              >
                <TabList>
                  <Tab>NFTs</Tab>
                  <Tab isDisabled={!address}>Activity</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box display="flex" flexDirection={'row'} width="100%">
                      <Box className="filter-container">
                        <FilterDrawer
                          collection={address}
                          renderContent={true}
                          showCollection={false}
                          pageName={PAGE_NAMES.COLLECTION}
                        />
                      </Box>
                      <Box width="82%">
                        <CollectionContents
                          name={name as string}
                          onTitle={(newTitle) => {
                            if (!title) {
                              setTitle(newTitle);
                            }
                          }}
                          onLoaded={({ address }) => onLoaded(address)}
                          listingSource={ListingSource.Infinity}
                        />
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel minWidth={'1025px'}>
                    <Box display="flex" flexDirection={'row'} marginTop={2}>
                      <Box marginRight={'40px'} minWidth={'180px'}>
                        <CollectionEventsFilter
                          filterState={eventFilterState}
                          setFilterState={setEventFilterState}
                          minWidth={'180px'}
                          width={70}
                          paddingBottom="30px"
                          borderBottom="1px solid #ccc"
                          zIndex={1}
                        />
                      </Box>

                      {address && (
                        <CollectionEvents
                          address={address}
                          eventType={eventFilterState}
                          pageType="collection"
                          flexGrow={1}
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
      } else {
        if (onLoaded) {
          onLoaded({ address: '' });
        }
      }
    }
  }, [cardProvider]);

  return (
    <>
      <NoData dataLoaded={cardProvider.hasLoaded} isFetching={!cardProvider.hasLoaded} data={cardProvider.list} />

      {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}

      <CardList
        pageName={PAGE_NAMES.COLLECTION}
        showItems={['PRICE']}
        userAccount={user?.account}
        data={cardProvider.list}
        action={NftAction.BuyNft}
      />

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
