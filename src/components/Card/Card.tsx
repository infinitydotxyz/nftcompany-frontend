import React, { useState } from 'react';
import Link from 'next/link';
import NFTModal from 'components/nft/NFTModal';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import styles from './CardList.module.scss';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import OfferStatusModal from 'components/OfferStatusModal/OfferStatusModal';
import PreviewModal from 'components/PreviewModal/PreviewModal';

export type CardData = {
  id: string;
  title: string;
  image: string;
  imagePreview?: string;
  price?: number;
  inStock?: number;
  viewInfo?: boolean;
  data?: any;
  tokenAddress?: string;
  tokenId?: string;
  collectionName?: string;
  maker?: string;
  hasBonusReward?: boolean;
  hasBlueCheck?: boolean;
  owner?: string;
};

type Props = {
  data: CardData;
  onClickPlaceBid?: () => void;
  onClickAction?: (item: any, action: string) => any;
  showItems?: string[];
  actions?: string[];
  [key: string]: any;
};

function Card({ data, onClickPlaceBid, onClickAction, viewInfo, showItems = ['PRICE'], actions = [], ...rest }: Props) {
  const [modalShowed, setModalShowed] = useState(false);
  const [placeBidModalShowed, setPlaceBidModalShowed] = useState(false);
  const [acceptOfferModalShowed, setAcceptOfferModalShowed] = useState(false);
  const [offerStatusModalShowed, setOfferStatusModalShowed] = useState(false);
  const [previewModalShowed, setPreviewModalShowed] = useState(false);

  if (!data) {
    return null;
  }

  const collectionName = data.collectionName;
  const hasBlueCheck = data.hasBlueCheck;
  return (
    <div id={`id_${data.id}`} className={styles.card} {...rest} onClick={() => setPreviewModalShowed(true)}>
      <div className={styles.cardPreview}>
        {/* <Image src={data.img} alt="Card preview" width="280" height="300" /> */}
        <img src={data.image} alt="Card preview" />

        <div className={styles.cardControls}>
          {/* <div className="status-green card__category">purchasing !</div> */}
          {/* <button className="card__favorite">
              <svg className="icon icon-heart"></svg>
            </button> */}
          {actions?.indexOf('LIST_NFT') >= 0 && (
            <a
              className={`${styles.button} button-small js-popup-open ${styles.cardButton}`}
              href="#popup-bid"
              data-effect="mfp-zoom-in"
              onClick={(ev) => {
                ev.preventDefault();
                // if (onClickPlaceBid) {
                //   onClickPlaceBid();
                // }
                if (onClickAction) {
                  onClickAction(data, 'LIST_NFT');
                }
                setModalShowed(true);
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
                // if (onClickPlaceBid) {
                //   onClickPlaceBid();
                // }
                if (onClickAction) {
                  onClickAction(data, 'CANCEL_LISTING');
                }
                setModalShowed(true);
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

                setOfferStatusModalShowed(true);
              }}
            >
              <span>Offer Status</span>
            </a>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardLine}>
          <div className={styles.cardTitle}>
            {collectionName && (
              <div className={styles.collectionName}>
                {collectionName}
                {hasBlueCheck === true ? ' ✅' : ''}
              </div>
            )}
            <div>{data.title}</div>
          </div>
          <div className={styles.cardPrice}>{showItems.indexOf('PRICE') >= 0 ? `${data.price} ETH` : ``}</div>
        </div>
        <div className={styles.cardLine}>
          <div>&nbsp;</div>
          {/* <div className="card__counter">{data.inStock} in stock</div> */}
        </div>
      </div>

      {placeBidModalShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidModalShowed(false)} />}
      {offerStatusModalShowed && <OfferStatusModal data={data} onClose={() => setOfferStatusModalShowed(false)} />}
      {acceptOfferModalShowed && <AcceptOfferModal data={data} onClose={() => setAcceptOfferModalShowed(false)} />}
      {previewModalShowed && <PreviewModal data={data} onClose={() => setPreviewModalShowed(false)} />}

      {/* {modalShowed && (
        <NFTModal
          title="AAVE"
          address="0xc812...AeFg"
          id="2456123"
          brandColor="#24DB83"
          bgColor="#E6FBF0"
          onClose={() => setModalShowed(false)}
        />
      )} */}

      {/* {modalShowed && <ListNFTModal onClose={() => setModalShowed(false)} />} */}
    </div>
  );
}

export default Card;
