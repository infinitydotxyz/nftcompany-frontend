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
import {
  transformAlchemy,
  transformOpenSea,
  transformCovalent,
  getNftDataSource,
  transformUnmarshal,
  getPageOffsetForAssetQuery
} from 'utils/commonUtil';
import { CardData } from 'types/Nft.interface';
import { NftAction } from 'types';
import { Box } from '@chakra-ui/layout';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import { SearchFilter } from 'utils/context/SearchContext';

export default function MyNFTs() {
  const { user, showAppError, chainId } = useAppContext();
  const [filter, setFilter] = useState<SearchFilter | null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [listModalItem, setListModalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [alchemyPageKey, setAlchemyPageKey] = useState('');

  const fetchData = async () => {
    if (!user || !user?.account || !chainId) {
      setData([]);
      return;
    }
    setIsFetching(true);
    const newCurrentPage = currentPage + 1;
    const source = getNftDataSource(chainId);
    const offset = getPageOffsetForAssetQuery(source, newCurrentPage, ITEMS_PER_PAGE);

    const { result, error } = await apiGet(`/u/${user?.account}/assets`, {
      offset, // not "startAfter" because this is not firebase query.
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

    const tokenAddresses: string[] = [];
    const moreData = (result?.assets || []).map((item: any) => {
      let newItem;
      if (source === NFT_DATA_SOURCES.OPENSEA) {
        newItem = transformOpenSea(item, user?.account, chainId);
      } else if (source === NFT_DATA_SOURCES.COVALENT) {
        newItem = transformCovalent(item, user?.account, chainId);
      } else if (source === NFT_DATA_SOURCES.UNMARSHAL) {
        newItem = transformUnmarshal(item, user?.account, chainId);
      } else if (source === NFT_DATA_SOURCES.ALCHEMY) {
        newItem = transformAlchemy(item, user?.account, chainId);
      }

      if (newItem?.tokenAddress && !tokenAddresses.includes(newItem.tokenAddress)) {
        tokenAddresses.push(newItem.tokenAddress);
      }
      return newItem;
    });

    // fetch bluechecks for assets' collections (tokenAddresses) & apply them:
    const { result: getBluecheckResult } = await apiGet(`/collections/verifiedIds?ids=${tokenAddresses.join(',')}`);
    moreData.forEach((item: CardData) => {
      if (getBluecheckResult?.collectionIds?.includes(item.tokenAddress)) {
        item.hasBlueCheck = true;
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
