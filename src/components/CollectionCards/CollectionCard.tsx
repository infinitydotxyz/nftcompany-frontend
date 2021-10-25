import React, { useState } from 'react';
import styles from './CollectionCards.module.scss';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { CollectionCardEntry } from 'types/rewardTypes';
import router from 'next/router';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { uuidv4 } from 'utils/commonUtil';
import { useInView } from 'react-intersection-observer';
import PreviewModal from 'components/PreviewModal/PreviewModal';

export const loadingCardData: CollectionCardEntry = {
  id: 'loading-card-id',
  address: '',
  name: '⠀', // placeholder char to avoid jumpy layout.
  description: '',
  cardImage: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', // blank image
  bannerImage: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', // blank image
  hasBlueCheck: false,
  openseaUrl: '',
  title: ''
};

type Props = {
  entry: CollectionCardEntry;
  isFeatured?: boolean;
};

function getSearchFriendlyString(input: string) {
  if (!input) {
    return '';
  }
  const noSpace = input.replace(/[\s-]/g, '');
  return noSpace.toLowerCase();
}

export const CollectionCard = ({ entry, isFeatured }: Props) => {
  const { ref, inView } = useInView({ threshold: 0 });
  const [previewModalShowed, setPreviewModalShowed] = useState(false);

  if (!entry) {
    return <div>Nothing found</div>;
  }

  let name = entry.name.replace(/\s/g, '');
  name = name.toLowerCase();

  if (inView === false) {
    return <div ref={ref} className={styles.outOfViewCard}></div>;
  }
  return (
    <div
      ref={ref}
      className={styles.tripleCard}
      onClick={() => {
        if (previewModalShowed) {
          return;
        }
        // name could have # and other url reseved characters
        // must encodeURIComponent()
        router.push(`/collection/${encodeURIComponent(name)}`);
      }}
    >
      <div className={styles.card1}></div>
      <div className={styles.card2}></div>

      <div className={`${styles.card3} ${isFeatured && styles.featuredCard}`}>
        <div className={styles.top}>
          <img className={styles.cardImage} src={entry.cardImage} alt="Card preview" />

          <div className={styles.cardControls}>
            <a
              className={`${styles.button} button-small js-popup-open ${styles.cardButton}`}
              href="#popup-bid"
              data-effect="mfp-zoom-in"
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                setPreviewModalShowed(true);
              }}
            >
              <span>More Info</span>
            </a>
          </div>
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

      {previewModalShowed && (
        <PreviewModal
          action={''}
          data={entry}
          previewCollection={true}
          onClose={() => {
            setPreviewModalShowed(false);
          }}
        />
      )}
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
