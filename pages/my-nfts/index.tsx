import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE, NFT_DATA_SOURCES, PAGE_NAMES } from 'utils/constants';
import { FetchMore, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { transformOpenSea, transformCovalent, getNftDataSource, transformUnmarshal } from 'utils/commonUtil';
import { CardData } from 'types/Nft.interface';
import { NftAction } from 'types';
import { Box } from '@chakra-ui/layout';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';

export default function MyNFTs() {
  const { user, showAppError, chainId } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [listModalItem, setListModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filter, setFilter] = useState({});

  const fetchData = async () => {
    if (!user || !user?.account || !chainId) {
      setData([]);
      return;
    }
    setIsFetching(true);
    const newCurrentPage = currentPage + 1;
    const source = getNftDataSource(chainId);

    const { result, error } = await apiGet(`/u/${user?.account}/assets`, {
      offset: newCurrentPage * ITEMS_PER_PAGE, // not "startAfter" because this is not firebase query.
      limit: ITEMS_PER_PAGE,
      source,
      ...filter
    });
    if (error) {
      showAppError(`${error.message}`);
      return;
    }
    const moreData = (result?.assets || []).map((item: any) => {
      if (source === NFT_DATA_SOURCES.OPENSEA) {
        return transformOpenSea(item, user?.account, chainId);
      } else if (source === NFT_DATA_SOURCES.COVALENT) {
        return transformCovalent(item, user?.account, chainId);
      } else if (source === NFT_DATA_SOURCES.UNMARSHAL) {
        return transformUnmarshal(item, user?.account, chainId);
      }
    });
    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    fetchData();
  }, [user, chainId, filter]);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>My NFTs</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">My NFTs</div>
          </div>

          <Box display="flex">
            {/* --- disable until /assets api (OS/alchemy/unmarshall...) can support filters */}
            {/* <Box className="filter-container">
              <FilterDrawer
                showSaleTypes={false}
                showPrices={false}
                onChange={(filter: any) => {
                  console.log('filter', filter);
                  setFilter(filter);
                }}
              />
            </Box> */}
            <Box>
              <PleaseConnectWallet account={user?.account} />
              <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={data} />
              {data?.length === 0 && isFetching && <LoadingCardList />}

              <CardList
                data={data}
                showItems={[]}
                userAccount={user?.account}
                action={NftAction.ListNft}
                pageName={PAGE_NAMES.MY_NFTS}
                onClickAction={(item) => {
                  setListModalItem(item);
                }}
              />
            </Box>
          </Box>
        </div>

        {dataLoaded && (
          <FetchMore
            currentPage={currentPage}
            data={data}
            onFetchMore={async () => {
              setDataLoaded(false);
              await fetchData();
            }}
          />
        )}

        {listModalItem && <ListNFTModal data={listModalItem} onClose={() => setListModalItem(null)} />}
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
MyNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
