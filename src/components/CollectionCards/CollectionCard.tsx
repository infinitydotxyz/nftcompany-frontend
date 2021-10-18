import React, { useState } from 'react';
import styles from './CollectionCards.module.scss';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { CollectionCardEntry } from 'types/rewardTypes';
import router from 'next/router';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { uuidv4 } from 'utils/commonUtil';

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
        router.push(`/collection/${name}`);
      }}
    >
      <div className={styles.card1}></div>
      <div className={styles.card2}></div>

      <div className={styles.card3}>
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

        return <CollectionCard key={item?.id || uuidv4()} entry={item} />;
      })}
    </div>
  );
};
