import React from 'react';
import styles from './CollectionCards.module.scss';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { CollectionCardEntry } from 'types/rewardTypes';
import router from 'next/router';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { uuidv4 } from 'utils/commonUtil';
import { useInView } from 'react-intersection-observer';
import { Button } from '@chakra-ui/react';

type Props = {
  entry: CollectionCardEntry;
  isFeatured?: boolean;
};

export const CollectionCard = ({ entry, isFeatured }: Props) => {
  const { ref, inView } = useInView({ threshold: 0 });

  if (!entry) {
    return <div>Nothing found</div>;
  }

  const clickButton = () => {
    // name could have # and other url reseved characters
    router.push(`/collection/${cleanCollectionName(entry.name)}`);
  };

  const cleanCollectionName = (input: string) => {
    if (!input) {
      return '';
    }

    // remove spaces and dashes
    let result = input.replace(/[\s-]/g, '');
    result = result.toLowerCase();

    // name could have # and other url reseved characters
    // must encodeURIComponent()
    return encodeURIComponent(result);
  };

  if (inView === false) {
    return <div ref={ref} className={styles.outOfViewCard}></div>;
  }

  return (
    <div ref={ref} className={`${styles.card} ${isFeatured && styles.featuredCard}`} onClick={clickButton}>
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

        <ShortAddress
          vertical={true}
          href={`https://etherscan.io/address/${entry.address}`}
          address={entry.address}
          label=""
          tooltip={entry.address}
        />
      </div>

      <Button mx={4} mt={3} size="lg" className={styles.stadiumButtonBlue} onClick={clickButton}>
        View collection
      </Button>
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
    <div className={`${styles.cardList}`}>
      {(data || []).map((item) => {
        if (!item) {
          return null;
        }

        return <CollectionCard key={item?.id || uuidv4()} entry={item} isFeatured={isFeatured} />;
      })}
    </div>
  );
};
