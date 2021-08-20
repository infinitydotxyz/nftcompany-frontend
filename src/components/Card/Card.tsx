import React, { useState } from 'react';
import Link from 'next/link';
import NFTModal from 'components/nft/NFTModal';
import styles from './CardList.module.scss';

export type CardData = {
  id: string;
  title: string;
  img: string;
  price?: number;
  inStock?: number;
};

function Card({ data, ...rest }: { data: CardData; [key: string]: any }) {
  const [modalShowed, setModalShowed] = useState(false);

  if (!data) {
    return null;
  }
  return (
    <div className={styles.card} {...rest}>
      <Link href={`/preview?id=${data.id}`} passHref>
        <div className={styles.cardPreview}>
          {/* <Image src={data.img} alt="Card preview" width="280" height="300" /> */}
          <img src={data.img} alt="Card preview" />

          <div className={styles.cardControls}>
            {/* <div className="status-green card__category">purchasing !</div> */}
            {/* <button className="card__favorite">
              <svg className="icon icon-heart"></svg>
            </button> */}
            <a
              className={`${styles.button} button-small js-popup-open ${styles.cardButton}`}
              href="#popup-bid"
              data-effect="mfp-zoom-in"
              onClick={(ev) => {
                ev.preventDefault();
                setModalShowed(true);
              }}
            >
              <span>Place a bid</span>
            </a>
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

      {modalShowed && (
        <NFTModal
          title="AAVE"
          address="0xc812...AeFg"
          id="2456123"
          brandColor="#24DB83"
          bgColor="#E6FBF0"
          onClose={() => setModalShowed(false)}
        />
      )}
    </div>
  );
}

export default Card;
