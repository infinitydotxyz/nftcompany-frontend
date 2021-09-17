import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import { Spinner } from '@chakra-ui/react';
// import { Select } from '@chakra-ui/react';
import CardList from 'components/Card/CardList';
import FilterPanel, { Filter } from 'components/FilterPanel/FilterPanel';
import { FilterIcon } from 'components/Icons/Icons';
import styles from '../../styles/Dashboard.module.scss';
import { getListingById, getListings, getListingsByCollectionName, orderToCardData } from 'services/Listings.service';
import {
  useExploreSearchContext,
  useFilterContext,
  useSetExploreSearchContext,
  useSetFilterContext
} from 'hooks/useSearch';
export default function Dashboard() {
  const [tabIndex, setTabIndex] = useState(1);
  const [filterShowed, setFilterShowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const exploreSearchContext = useExploreSearchContext();
  const setExploreSearchContext = useSetExploreSearchContext();
  const setFilterContext = useSetFilterContext();
  const filterContext = useFilterContext();

  const title = React.useMemo(() => {
    switch (tabIndex) {
      case 1:
        return 'Hot Bids 🔥';
        break;
      case 2:
        return 'Artistic 🎨';
        break;
      case 3:
        return 'Coins 🪙';
        break;
      case 4:
        return 'Games 🎮';
        break;
      case 5:
        return 'Music 🎵';
        break;

      default:
        break;
    }
  }, [tabIndex]);
  React.useEffect(() => {
    onSearch();
  }, [exploreSearchContext.collectionName, exploreSearchContext.selectedOption]);

  React.useEffect(() => {
    onSearch();
  }, []);
  const onSearch = async () => {
    setIsFetching(true);
    if (exploreSearchContext.collectionName) {
      // they selected a collection search for collections
      const response = await getListingsByCollectionName(exploreSearchContext.collectionName);
      if (response) {
        const cardData = response;
        setExploreSearchContext({ ...exploreSearchContext, listedNfts: cardData });
      }
    } else if (exploreSearchContext.selectedOption) {
      // they selected an asset search for that instead

      const response = await getListingById(
        exploreSearchContext.selectedOption.id,
        exploreSearchContext.selectedOption.address
      );
      if (response) {
        const cardData = orderToCardData(response);
        setExploreSearchContext({ ...exploreSearchContext, listedNfts: [cardData] });
      }
    } else {
      const response = await getListings();
      setExploreSearchContext({ ...exploreSearchContext, listedNfts: response });
    }
    setIsFetching(false);
  };

  const onFilterSearch = async (filter?: Filter) => {
    setIsFetching(true);
    let response;
    if (exploreSearchContext.collectionName) {
      response = await getListingsByCollectionName(exploreSearchContext.collectionName, filter);
      setExploreSearchContext({
        ...exploreSearchContext,
        listedNfts: response,
        collectionName: exploreSearchContext.collectionName
      });
    } else {
      response = await getListings(filter);
      setExploreSearchContext({ ...exploreSearchContext, listedNfts: response });
    }
    setIsFetching(false);
  };

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>

      <div className={styles.dashboard}>
        <div className="container container-fluid">
          <div className="section-bar">
            <div className="right">
              <div className="tg-title">{title}</div>
            </div>

            <div className="center"></div>

            <div className="left">
              <div className="center" style={{ flex: 1, marginRight: 30 }}>
                <ul className="links">
                  <li>
                    {!exploreSearchContext.selectedOption && (
                      <a className="active cpointer" onClick={() => setFilterShowed(!filterShowed)}>
                        Filter <FilterIcon />
                      </a>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            {!exploreSearchContext.selectedOption && (
              <FilterPanel
                filter={filterContext}
                setFilters={setFilterContext}
                isExpanded={filterShowed}
                getNftListings={onFilterSearch}
                exploreSearchState={exploreSearchContext}
              />
            )}
          </div>
          {isFetching ? (
            <Spinner size="md" color="gray.800" />
          ) : (
            <CardList showItems={[]} data={exploreSearchContext.listedNfts} actions={['BUY_NFT']} />
          )}
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line react/display-name
Dashboard.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
