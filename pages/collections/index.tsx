import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Collections.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiPost } from 'utils/apiUtil';
import { Spinner } from '@chakra-ui/spinner';
import { CollectionEntry } from 'types/rewardTypes';
import { CollectionsTable } from 'components/CollectionsTable/CollectionsTable';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';

const Collections = (): JSX.Element => {
  const { showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [collections, setCollections] = useState<CollectionEntry[]>([]);

  let insideFetch = false;

  const fetchCollections = async () => {
    let startAfterName;
    const limit = 50;

    if (insideFetch) {
      // console.log('too soon');
      return;
    }

    insideFetch = true;

    // only spin on first load
    if (collections.length === 0) {
      setIsFetching(true);
    } else {
      startAfterName = collections[collections.length - 1].name;
    }

    try {
      const body = { startAfterName, limit };

      const { result, error } = await apiPost('/verifiedTokens', {}, body);
      if (error) {
        showAppError('Failed to fetch rewards.');
        setHasMore(false);
      } else {
        if (result.collections) {
          const newCols = result.collections as CollectionEntry[];

          setCollections([...collections, ...newCols]);
        }

        if ((result.collections?.length ?? 0) === 0) {
          setHasMore(false);
        }
      }
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setIsFetching(false);
      insideFetch = false;
    }
  };

  React.useEffect(() => {
    fetchCollections();
  }, []);

  if (isFetching) {
    return (
      <>
        <Head>
          <title>Rewards</title>
        </Head>
        <div className={styles.main}>
          <div className={styles.spinner}>
            <div>
              <Spinner color="brandBlue" thickness="4px" height={26} width={26} emptyColor="gray.200" speed=".8s" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>NFT Collections</title>
      </Head>
      <div className={styles.main}>
        <div className="page-container">
          <div className={styles.content}>
            <div className={styles.centered}>
              <div className="section-bar" style={{ marginBottom: 30 }}>
                <div className="tg-title">NFT Collections</div>
              </div>
              <div className={styles.leaderBox}>
                <CollectionsTable entries={collections} />

                {hasMore && (
                  <ScrollLoader
                    onFetchMore={async () => {
                      fetchCollections();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line react/display-name
Collections.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
export default Collections;
