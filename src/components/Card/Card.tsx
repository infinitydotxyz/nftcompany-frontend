import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './CardList.module.scss';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import { CardData } from 'types/Nft.interface';
import PreviewModal from 'components/PreviewModal/PreviewModal';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { WETH_ADDRESS } from 'utils/constants';

type Props = {
  data: CardData;
  onClickAction?: (item: any, action: string) => any;
  showItems?: string[];
  action?: string;
  userAccount?: string;
  [key: string]: any;
};

function Card({ data, onClickAction, userAccount, showItems = ['PRICE'], action = '' }: Props) {
  const [placeBidModalShowed, setPlaceBidModalShowed] = useState(false);
  const [acceptOfferModalShowed, setAcceptOfferModalShowed] = useState(false);
  const [cancelOfferModalShowed, setCancelOfferModalShowed] = useState(false);
  const [previewModalShowed, setPreviewModalShowed] = useState(false);

  if (!data) {
    return null;
  }

  let ownedByYou = false;
  if (userAccount) {
    // opensea lowercases their account strings, so compare to lower
    ownedByYou = data.owner?.toLowerCase() === userAccount.toLowerCase();
  }

  const collectionName = data.collectionName;
  const hasBlueCheck = data.hasBlueCheck;
  return (
    <div id={`id_${data.id}`} className={styles.card}>
      {ownedByYou && <div className={styles.ownedTag}>Owned</div>}

      <div onClick={() => setPreviewModalShowed(true)}>
        <div className={styles.cardPreview}>
          <img src={data.image} alt="Card preview" />

          <div className={styles.cardControls}>
            {action === 'LIST_NFT' && (
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
            {action === 'BUY_NFT' && !ownedByYou && (
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
                <span>Purchase</span>
              </a>
            )}
            {action === 'CANCEL_LISTING' && (
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

            {action === 'ACCEPT_OFFER' && (
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

            {action === 'CANCEL_OFFER' && (
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
            <PriceBox
              justifyRight={true}
              price={showItems.indexOf('PRICE') >= 0 ? data.price : undefined}
              token={data?.data?.paymentToken === WETH_ADDRESS ? 'WETH' : 'ETH'}
              expirationTime={data?.expirationTime}
            />
          </div>
        </div>
      </div>

      {placeBidModalShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidModalShowed(false)} />}
      {cancelOfferModalShowed && <CancelOfferModal data={data} onClose={() => setCancelOfferModalShowed(false)} />}
      {acceptOfferModalShowed && <AcceptOfferModal data={data} onClose={() => setAcceptOfferModalShowed(false)} />}
      {previewModalShowed && (
        <PreviewModal
          action={action}
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
