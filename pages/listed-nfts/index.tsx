import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { FetchMore, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import { ListingSource } from 'services/Listings.service';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { CardData } from 'types/Nft.interface';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import styles from './ListNFTs.module.scss';
import { useUserListings } from 'hooks/useUserListings';

export default function ListNFTs() {
  const { user } = useAppContext();
  const [tabIndex, setTabIndex] = useState(0);
  const [deleteModalItem, setDeleteModalItem] = useState<CardData | null>(null);

  const transferOrder = (item: CardData) => {
    console.log('Transferring Order');
  };

  const Listings = (props: { source: ListingSource }) => {
    const { listings, isFetching, fetchMore, currentPage, dataLoaded } = useUserListings(props.source);
    const action = props.source === ListingSource.OpenSea ? 'TRANSFER_ORDER' : 'CANCEL_LISTING';

    return (
      <>
        <div>
          <PleaseConnectWallet account={user?.account} />
          <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={listings} />
          {listings?.length === 0 && isFetching && <LoadingCardList />}

          <CardList
            data={listings}
            action={action}
            onClickAction={async (item, action) => {
              if (action === 'TRANSFER_ORDER') {
                transferOrder(item);
              } else {
                setDeleteModalItem(item);
              }
            }}
          />
        </div>

        {dataLoaded && (
          <FetchMore
            currentPage={currentPage}
            data={listings}
            onFetchMore={() => {
              fetchMore();
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Listed NFTs</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Listed NFTs</div>
          </div>

          <div className="center">
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList className={styles.tabList}>
                <Tab>Infinity</Tab>
                <Tab>OpenSea</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Listings source={ListingSource.Infinity} />
                </TabPanel>

                {tabIndex === 1 && (
                  <TabPanel>
                    <Listings source={ListingSource.OpenSea} />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>

      {deleteModalItem && <CancelListingModal data={deleteModalItem} onClose={() => setDeleteModalItem(null)} />}
    </>
  );
}

// eslint-disable-next-line react/display-name
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
