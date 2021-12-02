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
import { Spacer, Tabs, TabPanels, TabPanel, TabList, Tab, Box } from '@chakra-ui/react';
import CollectionEvents from 'components/CollectionEvents/CollectionEvents';
import styles from './Collection.module.scss';
import { NftAction } from 'types';
import CollectionContents from 'components/CollectionContents/CollectionContents';

const Collection = (): JSX.Element => {
  const [title, setTitle] = useState<string | undefined>();
  const [address, setAddress] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();
  const {
    query: { name }
  } = router;

  return (
    <>
      <Head>
        <title>{title || name}</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">{title || name}</div>

            <Spacer />

            {tabIndex === 0 ? <SortMenuButton /> : <Box height={10}>&nbsp;</Box>}
          </div>

          <div className="center">
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList className={styles.tabList}>
                <Tab>NFTs</Tab>
                <Tab isDisabled={!address}>Sales</Tab>
                <Tab isDisabled={!address}>Transfers</Tab>
                <Tab isDisabled={!address}>Offers</Tab>
                <Tab>OpenSea</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {name && tabIndex === 0 && (
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
                  )}
                </TabPanel>
                <TabPanel>
                  {tabIndex === 1 && (
                    <CollectionEvents
                      address={address}
                      eventType="successful"
                      activityType="sale"
                      pageType="collection"
                    />
                  )}
                </TabPanel>
                <TabPanel>
                  {tabIndex === 2 && (
                    <CollectionEvents
                      address={address}
                      eventType="transfer"
                      activityType="transfer"
                      pageType="collection"
                    />
                  )}
                </TabPanel>
                <TabPanel>
                  {tabIndex === 3 && (
                    <CollectionEvents
                      address={address}
                      eventType="bid_entered"
                      activityType="offer"
                      pageType="collection"
                    />
                  )}
                </TabPanel>
                <TabPanel>
                  {tabIndex === 4 && (
                    <>
                      {name && (
                        <CollectionContents
                          name={name as string}
                          onTitle={(newTitle) => {
                            if (!title) {
                              setTitle(newTitle);
                            }
                          }}
                          onLoaded={({ address }) => setAddress(address)}
                          listingSource={ListingSource.OpenSea}
                          address={address}
                        />
                      )}
                    </>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
Collection.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Collection;

// =============================================================
