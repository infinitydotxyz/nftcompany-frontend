import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import { FetchMore, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { NftAction } from 'types';
import { Box } from '@chakra-ui/react';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import styles from './OffersMade.module.scss';
import { SearchFilter, useSearchContext } from 'utils/context/SearchContext';
import { useUserOffersMade } from 'hooks/useUserOffersMade';
import { PAGE_NAMES } from 'utils/constants';

export default function OffersMade() {
  const { user } = useAppContext();
  const [filter, setFilter] = useState<SearchFilter | null>(null);

  const OffersMade = () => {
    const { offers, isFetching, fetchMore, currentPage, dataLoaded } = useUserOffersMade(filter);

    return (
      <>
        <div>
          <PleaseConnectWallet account={user?.account} />
          <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={offers} />
          {offers?.length === 0 && isFetching && <LoadingCardList />}

          <CardList
            pageName={PAGE_NAMES.OFFERS_MADE}
            data={offers}
            action={NftAction.CancelOffer}
            userAccount={user?.account}
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
        <title>Offers Made</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Offers Made</div>
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
              <OffersMade />
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
OffersMade.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
