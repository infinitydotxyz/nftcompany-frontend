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
import { Tab, TabList, Tabs } from '@chakra-ui/react';
import styles from './ListNFTs.module.scss';
import { useUserListings } from 'hooks/useUserListings';

enum TabIndex {
  Infinity,
  OpenSea
}

export default function ListNFTs() {
  const { user } = useAppContext();
  const [tabIndex, setTabIndex] = useState(0);
  const [source, setSource] = useState(ListingSource.Infinity);
  const { listings, isFetching, fetchMore, currentPage, dataLoaded } = useUserListings(source);
  const [deleteModalItem, setDeleteModalItem] = useState<CardData | null>(null);

  useEffect(() => {
    switch (tabIndex) {
      case TabIndex.Infinity:
        setSource(ListingSource.Infinity);
        break;
      case TabIndex.OpenSea:
        setSource(ListingSource.OpenSea);
        break;
      default:
        setSource(ListingSource.Infinity);
    }
  }, [tabIndex]);

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
            </Tabs>
            <div>
              <PleaseConnectWallet account={user?.account} />
              <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={listings} />
              {listings?.length === 0 && isFetching && <LoadingCardList />}

              <CardList
                data={listings}
                action="CANCEL_LISTING"
                onClickAction={async (item, action) => {
                  setDeleteModalItem(item);
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
          </div>
        </div>
      </div>

      {deleteModalItem && <CancelListingModal data={deleteModalItem} onClose={() => setDeleteModalItem(null)} />}
    </>
  );
}

// eslint-disable-next-line react/display-name
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
