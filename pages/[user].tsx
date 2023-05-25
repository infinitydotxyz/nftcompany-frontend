import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE, NFT_DATA_SOURCES } from 'utils/constants';
import { FetchMore, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { useRouter } from 'next/router';
import {
  transformAlchemy,
  transformOpenSea,
  transformCovalent,
  getNftDataSource,
  transformUnmarshal,
  getPageOffsetForAssetQuery
} from 'utils/commonUtil';
import { CardData } from '@infinityxyz/lib/types/core';
import { Box } from '@chakra-ui/layout';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import { SearchFilter } from 'utils/context/SearchContext';
import FilterPills from 'components/FilterDrawer/FilterPills';

export default function UserPage() {
  const { user, showAppError, chainId } = useAppContext();
  const [filter, setFilter] = useState<SearchFilter | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [alchemyPageKey, setAlchemyPageKey] = useState('');

  const router = useRouter();
  const {
    query: { user: userParam }
  } = router;

  const fetchData = async () => {
    if (!userParam || userParam.length === 0) {
      setData([]);
      return;
    }

    setIsFetching(true);
    const newCurrentPage = currentPage + 1;
    const source = getNftDataSource(chainId);
    const offset = getPageOffsetForAssetQuery(source, newCurrentPage, ITEMS_PER_PAGE);

    const { result, error } = await apiGet(`/p/u/${userParam}/assets`, {
      offset,
      limit: ITEMS_PER_PAGE,
      source,
      chainId,
      pageKey: alchemyPageKey,
      ...filter
    });

    if (error) {
      showAppError(`${error.message}`);
      return;
    }
    const moreData = (result?.assets || []).map((item: any) => {
      if (source === NFT_DATA_SOURCES.OPENSEA) {
        return transformOpenSea(item, userParam as string, chainId);
      } else if (source === NFT_DATA_SOURCES.COVALENT) {
        return transformCovalent(item, userParam as string, chainId);
      } else if (source === NFT_DATA_SOURCES.UNMARSHAL) {
        return transformUnmarshal(item, userParam as string, chainId);
      } else if (source === NFT_DATA_SOURCES.ALCHEMY) {
        return transformAlchemy(item, userParam as string, chainId);
      }
    });
    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
    // alchemy pagination
    if (result?.pageKey) {
      setAlchemyPageKey(result.pageKey);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [userParam, filter]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }

    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>{"User's NFTs"}</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">{"User's NFTs"}</div>
          </div>

          <Box display="flex">
            <FilterPills />

            <Box className="filter-container">
              <FilterDrawer
                showSaleTypes={false}
                showPrices={false}
                onChange={(filter: SearchFilter) => {
                  setCurrentPage(-1);
                  setData([]);
                  setFilter(filter);
                }}
              />
            </Box>
            <Box className="content-container">
              <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={data} />
              {data?.length === 0 && isFetching && <LoadingCardList />}

              <CardList data={data} showItems={[]} userAccount={user?.account} />
            </Box>
          </Box>
        </div>

        {dataLoaded && (
          <FetchMore
            currentPage={currentPage}
            onFetchMore={async () => {
              setDataLoaded(false);
              await fetchData();
            }}
          />
        )}
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
UserPage.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
