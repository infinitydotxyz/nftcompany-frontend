import React from 'react';
import { CollectionCardEntry } from '@infinityxyz/lib/types/core';
import router from 'next/router';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { getSearchFriendlyString, uuidv4 } from 'utils/commonUtil';
import { useInView } from 'react-intersection-observer';
import styles from './CollectionCards.module.scss';

type Props = {
  entry: CollectionCardEntry;
  isFeatured?: boolean;
};

export const CollectionCard = ({ entry, isFeatured }: Props) => {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '500px 0px 500px 0px' });

  if (!entry) {
    return <div>Nothing found</div>;
  }

  const cleanCollectionName = (input: string) => {
    if (!input) {
      return '';
    }

    const result = getSearchFriendlyString(input);

    // name could have # and other url reseved characters
    // must encodeURIComponent()
    return encodeURIComponent(result);
  };

  if (inView === false) {
    return <div ref={ref} className={styles.outOfViewCard}></div>;
  }

  return (
    <div ref={ref} className={styles.tripleCard}>
      <div
        className={`${styles.card3} ${isFeatured && styles.featuredCard}`}
        onClick={() => router.push(`/collection/${cleanCollectionName(entry.name)}`)}
      >
        <div className={styles.top}>
          <img className={styles.cardImage} src={entry.cardImage} alt="Card preview" />
        </div>

        <div className={styles.bottom}>
          <div className={styles.collectionRow}>
            <div>{entry.name}</div>

            <div style={{ paddingLeft: 6 }}>
              <BlueCheckIcon hasBlueCheck={entry.hasBlueCheck} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================

type xProps = {
  data: CollectionCardEntry[];
  isFeatured?: boolean;
};

export const CardGrid = ({ data, isFeatured = false }: xProps): JSX.Element => {
  return (
    <div className={styles.cardList}>
      {(data || []).map((item) => {
        if (!item) {
          return null;
        }

        return <CollectionCard key={item?.id || uuidv4()} entry={item} isFeatured={isFeatured} />;
      })}
    </div>
  );
};
