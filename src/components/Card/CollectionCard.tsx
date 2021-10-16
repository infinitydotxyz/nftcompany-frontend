import React, { useState } from 'react';
import styles from './CardList.module.scss';
import PreviewModal from 'components/PreviewModal/PreviewModal';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { WETH_ADDRESS } from 'utils/constants';
import { useRouter } from 'next/router';

export const loadingCardData = {
  id: 'loading-card-id',
  address: '',
  name: '⠀', // placeholder char to avoid jumpy layout.
  cardImage: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', // blank image
  hasBlueCheck: false,
  title: '⠀' // placeholder char to avoid jumpy layout.
};

export type CollectionCardData = {
  id: string;
  address: string;
  name: string;
  cardImage: string;
  hasBlueCheck: boolean;
  title: string;
};

type Props = {
  data: CollectionCardData;
  isLoadingCard?: boolean;
  onClickAction?: (item: any, action: string) => any;
  showItems?: string[];
  action?: string;
  userAccount?: string;
  [key: string]: any;
};

function getSearchFriendlyString(input: string) {
  if (!input) {
    return '';
  }
  const noSpace = input.replace(/\s/g, '');
  return noSpace.toLowerCase();
}

function CollectionCard({ data, isLoadingCard, onClickAction, action = '' }: Props) {
  const router = useRouter();
  const [previewModalShowed, setPreviewModalShowed] = useState(false);

  if (!data) {
    return null;
  }
  const collectionName = data.name;
  data.title = data.name;

  const hasBlueCheck = data.hasBlueCheck;
  return (
    <div id={`id_${data.id}`} className={styles.card}>
      {isLoadingCard !== true && <div className={styles.featured}>🔥</div>}

      <div
        onClick={() => {
          router.push(`/collection/${getSearchFriendlyString(data.name)}`);
        }}
      >
        <div className={styles.cardPreview}>
          <img src={data.cardImage} alt="Card preview" />

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

        <div className={styles.cardBody}>
          <div className={styles.cardLine}>
            <div className={styles.cardTitle}>
              {collectionName && (
                <div className={styles.collectionRow}>
                  <div className={styles.collectionName}>{collectionName}</div>

                  <div style={{ paddingLeft: 6 }}>
                    <BlueCheckIcon hasBlueCheck={hasBlueCheck === true} />
                  </div>
                </div>
              )}
              {/* <div className={styles.title}>{data.title}</div> */}
            </div>
            {/* <PriceBox
              justifyRight
              price={showItems.indexOf('PRICE') >= 0 ? data.metadata?.basePriceInEth : undefined}
              token={data?.order?.paymentToken === WETH_ADDRESS ? 'WETH' : 'ETH'}
              expirationTime={data?.expirationTime}
            /> */}
          </div>
        </div>
      </div>

      {previewModalShowed && (
        <PreviewModal
          action={action}
          data={data}
          previewCollection={true}
          onClose={() => {
            setPreviewModalShowed(false);
          }}
        />
      )}
    </div>
  );
}

export default CollectionCard;
