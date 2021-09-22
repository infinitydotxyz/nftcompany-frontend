import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './CardList.module.scss';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import { CardData } from 'types/Nft.interface';
import PreviewModal from 'components/PreviewModal/PreviewModal';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PriceBox } from 'components/PriceBox/PriceBox';

type Props = {
  data: CardData;
  onClickPlaceBid?: () => void;
  onClickAction?: (item: any, action: string) => any;
  showItems?: string[];
  actions?: string[];
  [key: string]: any;
};

function Card({ data, onClickPlaceBid, onClickAction, viewInfo, showItems = ['PRICE'], actions = [], ...rest }: Props) {
  const [placeBidModalShowed, setPlaceBidModalShowed] = useState(false);
  const [acceptOfferModalShowed, setAcceptOfferModalShowed] = useState(false);
  const [cancelOfferModalShowed, setCancelOfferModalShowed] = useState(false);
  const [previewModalShowed, setPreviewModalShowed] = useState(false);

  if (!data) {
    return null;
  }

  const collectionName = data.collectionName;
  const hasBlueCheck = data.hasBlueCheck;
  return (
    <div id={`id_${data.id}`} className={styles.card} {...rest}>
      <div onClick={() => setPreviewModalShowed(true)}>
        <div className={styles.cardPreview}>
          <img src={data.image} alt="Card preview" />

          <div className={styles.cardControls}>
            {actions?.indexOf('LIST_NFT') >= 0 && (
              <a
                className={`${styles.button} button-small js-popup-open ${styles.cardButton}`}
                href="#popup-bid"
                data-effect="mfp-zoom-in"
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();

                  if (onClickAction) {
                    onClickAction(data, 'LIST_NFT');
                  }
                }}
              >
                <span>List NFT</span>
              </a>
            )}
            {actions?.indexOf('BUY_NFT') >= 0 && (
              <a
                className={`${styles.button} button-small js-popup-open ${styles.cardButton}`}
                href="#popup-bid"
                data-effect="mfp-zoom-in"
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();

                  setPlaceBidModalShowed(true);
                }}
              >
                <span>Buy NFT</span>
              </a>
            )}
            {actions?.indexOf('CANCEL_LISTING') >= 0 && (
              <a
                className={`${styles.button} button-small js-popup-open ${styles.cardButton}`}
                href="#popup-bid"
                data-effect="mfp-zoom-in"
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();

                  if (onClickAction) {
                    onClickAction(data, 'CANCEL_LISTING');
                  }
                }}
              >
                <span>Cancel Listing</span>
              </a>
            )}

            {actions?.indexOf('ACCEPT_OFFER') >= 0 && (
              <a
                className={`${styles.button} button-small js-popup-open ${styles.cardButton}`}
                href="#popup-bid"
                data-effect="mfp-zoom-in"
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();

                  setAcceptOfferModalShowed(true);
                }}
              >
                <span>Accept Offer</span>
              </a>
            )}

            {actions?.indexOf('CANCEL_OFFER') >= 0 && (
              <a
                className={`${styles.button} button-small js-popup-open ${styles.cardButton}`}
                href="#popup-bid"
                data-effect="mfp-zoom-in"
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();

                  setCancelOfferModalShowed(true);
                }}
              >
                <span>Cancel Offer</span>
              </a>
            )}
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardLine}>
            <div className={styles.cardTitle}>
              {collectionName && (
                <div className={styles.collectionRow}>
                  <div className={styles.collectionName}>{collectionName}</div>

                  <BlueCheckIcon hasBlueCheck={hasBlueCheck === true} />
                </div>
              )}
              <div>{data.title}</div>
            </div>
            <PriceBox price={showItems.indexOf('PRICE') >= 0 ? data.price : undefined} />
          </div>
        </div>
      </div>

      {placeBidModalShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidModalShowed(false)} />}
      {cancelOfferModalShowed && <CancelOfferModal data={data} onClose={() => setCancelOfferModalShowed(false)} />}
      {acceptOfferModalShowed && <AcceptOfferModal data={data} onClose={() => setAcceptOfferModalShowed(false)} />}
      {previewModalShowed && (
        <PreviewModal
          data={data}
          onClose={() => {
            setPreviewModalShowed(false);
          }}
        />
      )}
    </div>
  );
}

export default Card;
