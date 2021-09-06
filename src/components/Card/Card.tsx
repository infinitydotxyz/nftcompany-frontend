import React, { useState } from 'react';
import Link from 'next/link';
import NFTModal from 'components/nft/NFTModal';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import styles from './CardList.module.scss';

export type CardData = {
  id: string;
  title: string;
  image: string;
  imagePreview?: string;
  price?: number;
  inStock?: number;
  viewInfo?: boolean;
  data?: any;
};

type Props = {
  data: CardData;
  onClickPlaceBid?: () => void;
  onClickAction?: (item: any, action: string) => any;
  actions?: string[];
  [key: string]: any;
};

function Card({ data, onClickPlaceBid, onClickAction, viewInfo, actions = [], ...rest }: Props) {
  const [modalShowed, setModalShowed] = useState(false);

  if (!data) {
    return null;
  }
  return (
    <div className={styles.card} {...rest}>
      <Link href={`/preview?id=${data.id}${viewInfo ? '&view=info' : ''}`} passHref>
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
          </div>
        </div>
      </Link>

      <div className={styles.cardBody}>
        <div className={styles.cardLine}>
          <div className={styles.cardTitle}>{data.title}</div>
          <div className={styles.cardPrice}>{data.price} ETH</div>
        </div>
        <div className={styles.cardLine}>
          <div>&nbsp;</div>
          <div className="card__counter">{data.inStock} in stock</div>
        </div>
      </div>

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

      {/* {modalShowed && <PlaceBidModal onClose={() => setModalShowed(false)} />} */}

      {/* {modalShowed && <ListNFTModal onClose={() => setModalShowed(false)} />} */}
    </div>
  );
}

export default Card;
