import React, { useState } from 'react';
import styles from './CollectionCards.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { apiPost } from 'utils/apiUtil';
import { Spinner } from '@chakra-ui/spinner';
import { ScrollLoader } from 'components/FetchMore/ScrollLoader';
import { Link } from '@chakra-ui/react';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { toChecksumAddress } from 'utils/commonUtil';
import { CollectionsTable } from 'components/CollectionsTable/CollectionsTable';
import { CollectionCardEntry } from 'types/rewardTypes';

type MProps = {
  listMode?: boolean;
};

export const CollectionCards = ({ listMode = false }: MProps): JSX.Element => {
  const { showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [collections, setCollections] = useState<CollectionCardEntry[]>([]);

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

      const { result, error } = await apiPost('/verifiedCollections', {}, body);
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

  if (listMode) {
    return (
      <div className={styles.main}>
        <CollectionsTable entries={collections} />
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

  return (
    <div className={styles.main}>
      <CardGrid data={collections} />;
      {hasMore && (
        <ScrollLoader
          onFetchMore={async () => {
            fetchCollections();
          }}
        />
      )}
    </div>
  );
};

// =============================================================

type Props = {
  entry: CollectionCardEntry;
};

export const CollectionCard = ({ entry }: Props) => {
  if (!entry) {
    return <div>Nothing found</div>;
  }

  let name = entry.name.replace(/\s/g, '');
  name = name.toLowerCase();

  return (
    <div
      className={styles.tripleCard}
      onClick={() => {
        window.open(`${window.origin}/collection/${name}`, '_blank');
      }}
    >
      <div className={styles.card1}></div>
      <div className={styles.card2}></div>

      <div className={styles.card3}>
        <div className={styles.top}>
          <img className={styles.cardImage} src={entry.cardImage} alt="Card preview" />
        </div>
        <div className={styles.bottom}>
          <div>{entry.name}</div>

          <ShortAddress
            vertical={true}
            href={`https://etherscan.io/address/${entry.address}`}
            address={entry.address}
            label=""
            isEthAddress={false}
            tooltip={entry.address}
          />
        </div>
      </div>
    </div>
  );
};

// =============================================================

type xProps = {
  data: CollectionCardEntry[];
};

export const CardGrid = ({ data }: xProps): JSX.Element => {
  return (
    <div className={`${styles.cardList}`}>
      {(data || []).map((item) => {
        if (!item) {
          return null;
        }

        return <CollectionCard key={item?.id} entry={item} />;
      })}
    </div>
  );
};
