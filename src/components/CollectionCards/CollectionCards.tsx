import React, { useState } from 'react';
import styles from './CollectionCards.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiPost } from 'utils/apiUtil';
import { Spinner } from '@chakra-ui/spinner';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { CollectionsTable } from 'components/CollectionsTable/CollectionsTable';
import { CollectionCardEntry } from 'types/rewardTypes';
import useResizeObserver from 'use-resize-observer';
import { CardGrid } from './CollectionCard';
import { ITEMS_PER_PAGE } from 'utils/constants';

type MProps = {
  listMode?: boolean;
  rows?: number;
};

export const CollectionCards = ({ rows = 0, listMode = false }: MProps): JSX.Element => {
  const { showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [collections, setCollections] = useState<CollectionCardEntry[]>([]);

  const { ref, width = 1 } = useResizeObserver<HTMLDivElement>();

  let maxCards = 0;
  let colsPerRow = 4;
  if (rows > 0) {
    if (width > 1245) {
      colsPerRow = 4;
    } else if (width > 925) {
      colsPerRow = 3;
    } else if (width > 650) {
      colsPerRow = 2;
    } else {
      colsPerRow = 1;
    }

    maxCards = rows * colsPerRow;
  }

  let insideFetch = false;

  const fetchCollections = async () => {
    let startAfterName;
    let limit = ITEMS_PER_PAGE;

    if (rows !== 0) {
      // maxCards won't be set the first call, but just get a resonable amount
      limit = rows * 5;
    }

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

      const { result, error } = await apiPost(`/verifiedTokens`, {}, body);

      // not ready yet
      // const { result, error } = await apiPost('/verifiedCollections', {}, body);

      if (error) {
        showAppError('Failed to fetch verified collections.');
        setHasMore(false);
      } else {
        if (result.collections) {
          const newCols = result.collections as CollectionCardEntry[];

          setCollections([...collections, ...newCols]);
        }

        if ((result.collections?.length ?? 0) === 0) {
          setHasMore(false);
        } else if (rows !== 0) {
          // only get one time if rows set
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
      <div className={styles.main}>
        <div className={styles.spinner}>
          <div>
            <Spinner color="brandBlue" thickness="4px" height={26} width={26} emptyColor="gray.200" speed=".8s" />
          </div>
        </div>
      </div>
    );
  }

  let collectionData = collections;

  if (rows !== 0 && collectionData.length > maxCards) {
    collectionData = collectionData.slice(0, maxCards);
  }

  let contents;

  // force list view for now
  // if (listMode) {
  if (true) {
    contents = (
      <div className={styles.main}>
        <CollectionsTable entries={collectionData} />
        {hasMore && rows === 0 && (
          <ScrollLoader
            onFetchMore={async () => {
              fetchCollections();
            }}
          />
        )}
      </div>
    );
  } else {
    contents = (
      <div className={styles.main}>
        <CardGrid data={collectionData} />;
        {hasMore && (
          <ScrollLoader
            onFetchMore={async () => {
              fetchCollections();
            }}
          />
        )}
      </div>
    );
  }

  return <div ref={ref}>{contents}</div>;
};
