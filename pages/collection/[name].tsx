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
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import { Spacer, Tabs, TabPanels, TabPanel, TabList, Tab, Box, Spinner, propNames } from '@chakra-ui/react';
import CollectionEvents from 'components/CollectionEvents/CollectionEvents';
import styles from './Collection.module.scss';
import { NftAction } from 'types';
import { CollectionData, getCollectionInfo } from 'services/Collections.service';
import CollectionOverview from 'components/CollectionOverview/CollectionOverview';
import CollectionStats from 'components/CollectionStats/CollectionStats';
import CollectionLinks from 'components/CollectionLinks/CollectionLinks';
import { renderSpinner } from 'utils/commonUtil';

const Collection = (): JSX.Element => {
  const [title, setTitle] = useState<string | undefined>();
  const [address, setAddress] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();
  const { name } = router.query;

  const [collectionInfo, setCollectionInfo] = useState<CollectionData | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(router.query);
    console.log(name);
    let isActive = true;
    setIsLoading(true);
    getCollectionInfo(name as string)
      .then((collectionInfo) => {
        if (isActive) {
          setCollectionInfo(collectionInfo);
          setIsLoading(false);
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
      <div className="page-container" style={{ paddingTop: '40px' }}>
        {isLoading ? (
          <Box display="flex" justifyContent={'center'} alignItems={'center'} height="400px">
            <div>{renderSpinner()}</div>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <Box maxWidth={'45%'}>
                <CollectionOverview
                  collectionName={collectionInfo?.name ?? ''}
                  hasBlueCheck={collectionInfo?.hasBlueCheck ?? false}
                  profileImage={collectionInfo?.profileImage ?? ''}
                  hasBeenClaimed={false}
                  creator={'ArtBlocks_Admin'}
                  description={collectionInfo?.description}
                />
              </Box>
              <Box width="45%">
                <Box marginBottom={'32px'}>
                  {collectionInfo?.stats && <CollectionStats stats={collectionInfo.stats} />}
                </Box>
                <Box marginBottom={'32px'}>
                  {collectionInfo?.links && <CollectionLinks links={collectionInfo.links} />}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </div>
    </>
  );
  // return (
  //   <>
  //     <Head>
  //       <title>{title || name}</title>
  //     </Head>
  //     <div>
  //       <div className="page-container">
  //         <div className="section-bar">
  //           <div className="tg-title">{title || name}</div>

  //           <Spacer />

  //           {tabIndex === 0 ? <SortMenuButton /> : <Box height={10}>&nbsp;</Box>}
  //         </div>

  //         <div className="center">
  //           <Tabs onChange={(index) => setTabIndex(index)}>
  //             <TabList className={styles.tabList}>
  //               <Tab>NFTs</Tab>
  //               <Tab isDisabled={!address}>Sales</Tab>
  //               <Tab isDisabled={!address}>Transfers</Tab>
  //               <Tab isDisabled={!address}>Offers</Tab>
  //             </TabList>

  //             <TabPanels>
  //               <TabPanel>
  //                 {name && tabIndex === 0 && (
  //                   <CollectionContents
  //                     name={name as string}
  //                     onTitle={(newTitle) => {
  //                       if (!title) {
  //                         setTitle(newTitle);
  //                       }
  //                     }}
  //                     onLoaded={({ address }) => setAddress(address)}
  //                     listingSource={ListingSource.Infinity}
  //                   />
  //                 )}
  //               </TabPanel>
  //               <TabPanel>
  //                 {tabIndex === 1 && (
  //                   <CollectionEvents
  //                     address={address}
  //                     eventType="successful"
  //                     activityType="sale"
  //                     pageType="collection"
  //                   />
  //                 )}
  //               </TabPanel>
  //               <TabPanel>
  //                 {tabIndex === 2 && (
  //                   <CollectionEvents
  //                     address={address}
  //                     eventType="transfer"
  //                     activityType="transfer"
  //                     pageType="collection"
  //                   />
  //                 )}
  //               </TabPanel>
  //               <TabPanel>
  //                 {tabIndex === 3 && (
  //                   <CollectionEvents
  //                     address={address}
  //                     eventType="bid_entered"
  //                     activityType="offer"
  //                     pageType="collection"
  //                   />
  //                 )}
  //               </TabPanel>
  //             </TabPanels>
  //           </Tabs>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
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
