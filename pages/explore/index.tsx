import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { NoData } from 'components/FetchMore/FetchMore';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import SortMenuButton from 'components/SortMenuButton/SortMenuButton';
import { useCardProvider } from 'hooks/useCardProvider';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { useAppContext } from 'utils/context/AppContext';
import { CardGrid } from 'components/CollectionCards/CollectionCard';
import { CollectionCardEntry } from 'types/rewardTypes';
import { ListingSource, useSearchContext } from 'utils/context/SearchContext';
import CardList from 'components/Card/CardList';
import { Spacer, Tabs, TabPanels, TabPanel, TabList, Tab, Box } from '@chakra-ui/react';
import FeaturedCollections from 'components/FeaturedCollections/FeaturedCollections';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';

export default function ExplorePage() {
  const searchContext = useSearchContext();
  const cardProvider = useCardProvider(ListingSource.Infinity, searchContext.searchState, searchContext.filterState);
  const { searchState, filterState } = useSearchContext();
  const [tabIndex, setTabIndex] = useState(0);
  const { user } = useAppContext();

  const collectionCards = cardProvider.list.map((x) => {
    return {
      id: x.id,
      name: x.collectionName,
      address: x.tokenAddress,
      cardImage: x.image,
      description: x.description,
      hasBlueCheck: x.hasBlueCheck
    } as CollectionCardEntry;
  });

  const searchText = searchState.text;
  const searchCollName = searchState.collectionName;
  let searchMode =
    searchText?.length > 0 ||
    searchCollName?.length > 0 ||
    filterState?.collectionName?.length > 0 ||
    filterState.priceMin !== '' ||
    filterState.priceMax !== '';
  searchMode = searchMode || filterState.listType !== '';

  let contents;
  if (searchMode) {
    contents = <CardList showItems={['PRICE']} userAccount={user?.account} data={cardProvider.list} action="BUY_NFT" />;
  } else {
    contents = <CardGrid data={collectionCards} />;
  }

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <div>
        <div className="page-container">
          <Tabs onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab>Infinity</Tab>
              <Tab>OpenSea</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {!searchMode && <FeaturedCollections />}

                <div className="section-bar">
                  <div className="tg-title">Explore</div>

                  <Spacer />
                  <SortMenuButton disabled={!searchMode} />
                </div>
                <NoData
                  dataLoaded={cardProvider.hasLoaded}
                  isFetching={!cardProvider.hasLoaded}
                  data={cardProvider.list}
                />
                {!cardProvider.hasData() && !cardProvider.hasLoaded && <LoadingCardList />}

                {contents}

                {cardProvider.hasData() && (
                  <ScrollLoader
                    onFetchMore={async () => {
                      cardProvider.loadNext();
                    }}
                  />
                )}
              </TabPanel>

              <TabPanel>
                {tabIndex === 4 && (
                  <p>
                    {
                      <div>Hello</div>
                      // <CollectionContents
                      //   name={name as string}
                      //   onTitle={(newTitle) => {
                      //     if (!title) {
                      //       setTitle(newTitle);
                      //     }
                      //   }}
                      //   onLoaded={({ address }) => setAddress(address)}
                      //   listingSource={ListingSource.OpenSea}
                      // />
                    }
                  </p>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>

      <FilterDrawer />
    </>
  );
}

// eslint-disable-next-line react/display-name
ExplorePage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
