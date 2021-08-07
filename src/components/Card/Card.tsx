import styles from './CardList.module.scss';

export default function Card() {
  return (
    <div className={styles.card}>
      <div className={styles.cardPreview}>
        <img src="https://ui8-crypter-nft-html.herokuapp.com/img/content/card-pic-3.jpg" alt="Card preview" />

        <div className={styles.cardControls}>
          <div className="status-green card__category">purchasing !</div>
          <button className="card__favorite">
            <svg className="icon icon-heart">{/* <use xlink:href="#icon-heart"></use> */}</svg>
          </button>
          <a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in">
            <span>Place a bid</span>
            <svg className="icon icon-scatter-up">{/* <use xlink:href="#icon-scatter-up"></use> */}</svg>
          </a>
        </div>
      </div>
      <a className="card__link" href="item.html">
        <div className="card__body">
          <div className={styles.cardLine}>
            <div className={styles.cardTitle}>Amazing digital art</div>
            <div className={styles.cardPrice}>2.45 ETH</div>
          </div>
          <div className="card__line">
            <div className="card__counter">3 in stock</div>
          </div>
        </div>
      </a>
    </div>
  );
}
