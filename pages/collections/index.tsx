import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import styles from './Collections.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiGet } from 'utils/apiUtil';
import { Spinner } from '@chakra-ui/spinner';
import { CollectionEntry } from 'types/rewardTypes';
import { CollectionsTable } from 'components/CollectionsTable/CollectionsTable';

const Collections = (): JSX.Element => {
  const { showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<CollectionEntry[]>([]);

  const fetchUserReward = async () => {
    setIsFetching(true);
    try {
      const { result, error } = await apiGet('/verified');
      if (error) {
        showAppError('Failed to fetch rewards.');
      } else {
        if (result.collections) {
          setCollections(result.collections as CollectionEntry[]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  React.useEffect(() => {
    fetchUserReward();
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
