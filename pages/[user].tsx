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
import { transformOpenSea, transformCovalent, getNftDataSource } from 'utils/commonUtil';
import { CardData } from 'types/Nft.interface';

export default function UserPage() {
  const { user, showAppError, chainId } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

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

    const { result, error } = await apiGet(`/p/u/${userParam}/assets`, {
      offset: newCurrentPage * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
      source
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
      }
    });
    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  React.useEffect(() => {
    fetchData();
  }, [userParam]);

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

          <div>
            <PleaseConnectWallet account={user?.account} />
            <NoData isFetching={isFetching} data={data} />
            {data?.length === 0 && isFetching && <LoadingCardList />}

            <CardList data={data} showItems={[]} />
          </div>
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
