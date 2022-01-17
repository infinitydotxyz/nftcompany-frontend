import React, { useEffect, useMemo, useState } from 'react';
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
import CollectionEvents from 'components/CollectionEvents/CollectionEvents';

const Collection = (): JSX.Element => {
  const [isFilterOpened, setIsFilterOpened] = React.useState(false);
  const [title, setTitle] = useState<string | undefined>();
  const [address, setAddress] = useState('');
  const router = useRouter();
  const { name } = router.query;

  const [collectionInfo, setCollectionInfo] = useState<CollectionData | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const [twitterData, setTwitterData] = useState<{ followersCount: number; timestamp: number }[]>([]);
  const [discordData, setDiscordData] = useState<{ membersCount: number; presenceCount: number; timestamp: number }[]>(
    []
  );

  const [toggleState, setToggleState] = useState(false);

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
    setIsLoading(true);
    getCollectionInfo(name as string)
      .then((collectionInfo) => {
        if (isActive) {
          setCollectionInfo(collectionInfo);
          setIsLoading(false);
          if (collectionInfo?.address) {
            setAddress(collectionInfo?.address);
          }
        }
      })
      .catch((err: any) => {
        console.error(err);
      });

    return () => {
      isActive = false;
    };
  }, [name]);

  return (
    <>
      <Head>
        <title>{title || name}</title>
      </Head>
      <div className="page-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {isLoading ? (
          <Box display="flex" justifyContent={'center'} alignItems={'center'} height="400px">
            <div>{renderSpinner()}</div>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column">
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
                />
              </Box>
              <Spacer />
              <Box flexGrow={3} flexBasis={0}>
                {collectionInfo?.stats && (
                  <CollectionInfoGroupWrapper>
                    <InfoGroup title="Collection Stats" minChildWidth="80px" maxChildWidth="80px" spacing="20px">
                      <CollectionStats stats={collectionInfo.stats} />
                    </InfoGroup>
                  </CollectionInfoGroupWrapper>
                )}
                {collectionInfo?.benefits && collectionInfo?.benefits?.length > 0 && (
                  <CollectionInfoGroupWrapper>
                    <InfoGroup title="Benfits of holding the NFTs" minChildWidth="100px" maxChildWidth="100px">
                      <CollectionBenefits benefits={collectionInfo.benefits} />
                    </InfoGroup>
                  </CollectionInfoGroupWrapper>
                )}
                {collectionInfo?.links && (
                  <CollectionInfoGroupWrapper>
                    <InfoGroup title="Follow us" minChildWidth="32px" maxChildWidth="64px">
                      <CollectionLinks links={collectionInfo.links} />
                    </InfoGroup>
                  </CollectionInfoGroupWrapper>
                )}
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
              <CollectionCommunity collectionInfo={collectionInfo} display={!toggleState ? 'none' : 'flex'} />
            )}

            <Box className="center" display={toggleState ? 'none' : 'flex'}>
              <Box className="filter-container">
                <FilterDrawer collection={address} renderContent={true} showCollection={false} />
              </Box>
              <Tabs align={'center'} display={toggleState ? 'none' : ''} className="content-container">
                <TabList>
                  <Tab>NFTs</Tab>
                  <Tab isDisabled={!address}>Activity</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
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
                  </TabPanel>
                  <TabPanel>
                    {address && (
                      <CollectionEvents
                        address={address}
                        eventType="successful"
                        activityType="sale"
                        pageType="collection"
                      />
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        )}
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
