import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import { FetchMore, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { SearchFilter } from 'utils/context/SearchContext';
import { Box } from '@chakra-ui/react';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import styles from './OffersReceived.module.scss';
import { useUserOffersReceived } from 'hooks/useUserOffersReceived';
import { NftAction } from 'types';
import { PAGE_NAMES } from 'utils/constants';

export default function OffersReceived() {
  const { user } = useAppContext();
  const [filter, setFilter] = useState<SearchFilter | null>(null);

  const OffersReceived = () => {
    const { offers, isFetching, fetchMore, currentPage, dataLoaded } = useUserOffersReceived(filter);

    return (
      <>
        <div>
          <PleaseConnectWallet account={user?.account} />
          <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={offers} />
          {offers?.length === 0 && isFetching && <LoadingCardList />}

          <CardList
            pageName={PAGE_NAMES.OFFERS_RECEIVED}
            data={offers}
            userAccount={user?.account}
            action={NftAction.AcceptOffer}
          />
        </div>
        {dataLoaded && (
          <FetchMore
            currentPage={currentPage}
            data={offers}
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
        <title>Offers Received</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Offers Received</div>
          </div>

          <Box className={styles.col}>
            <Box className="filter-container">
              <FilterDrawer
                showSaleTypes={false}
                onChange={(filter: SearchFilter) => {
                  setFilter(filter);
                }}
              />
            </Box>
            <Box className="content-container">
              <OffersReceived />
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
OffersReceived.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
