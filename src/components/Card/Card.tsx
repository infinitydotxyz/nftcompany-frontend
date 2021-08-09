import React, { useState } from 'react';
import Link from 'next/link';
import NFTModal from 'components/nft/NFTModal';
import styles from './CardList.module.scss';
import Image from "next/image";

export type CardData = {
  id: string;
  title: string;
  img: string;
};

export default function Card({ data }: { data: CardData }) {
  const [modalShowed, setModalShowed] = useState(false);

  return (
    <div className={styles.card}>
      <Link href={`/preview?id=${data.id}`}>
        <div className={styles.cardPreview}>
          <Image src={data.img} alt="Card preview" layout="fill" />

          <div className={styles.cardControls}>
            {/* <div className="status-green card__category">purchasing !</div> */}
            <button className="card__favorite">
              <svg className="icon icon-heart">{/* <use xlink:href="#icon-heart"></use> */}</svg>
            </button>
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
          <div className={styles.cardTitle}>Amazing digital art</div>
          <div className={styles.cardPrice}>2.45 ETH</div>
        </div>
        <div className={styles.cardLine}>
          <div>&nbsp;</div>
          <div className="card__counter">3 in stock</div>
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
