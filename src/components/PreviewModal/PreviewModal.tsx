import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import PurchaseModal from 'components/PurchaseModal/PurchaseModal';
import { Order } from 'types/Nft.interface';

import dynamic from 'next/dynamic';
import styles from './PreviewModal.module.scss';
import { CardData } from 'components/Card/Card';
const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface Props {
  data: CardData;
  onClose?: () => void;
}

const PreviewModal: React.FC<Props> = ({ onClose, data }: Props) => {
  const [placeBidShowed, setPlaceBidShowed] = useState(false);
  const [purchaseShowed, setPurchaseShowed] = useState(false);

  return (
    <>
      {!isServer && (
        <Modal
          brandColor={'blue'}
          isActive={true}
          onClose={onClose}
          activator={({ setShow }: any) => (
            <div onClick={() => setShow(true)} className={'nftholder'}>
              &nbsp;
            </div>
          )}
        >
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'blue' }}>
            <div className="modal-body">
              <div className={styles.title}>NFT Information</div>

              <div className={styles.space}>All you need to know about this NFT.</div>

              <div className={styles.main}>
                {data && data.image && (
                  <img
                    src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
                  />
                )}

                <section className={styles.info}>
                  <h3>{data?.title}</h3>
                  <span className={styles.price}>{data?.price} ETH</span>
                  <span className={styles.counter}>10 in stock</span>
                  <div className={styles.description}>{'data?.description'}</div>

                  <a className="action-btn" onClick={() => setPurchaseShowed(true)}>
                    Buy now
                  </a>
                  <a className="action-btn action-2nd" onClick={() => setPlaceBidShowed(true)}>
                    Make an offer
                  </a>
                </section>
              </div>

              <div className={styles.footer}>
                <a className="action-btn action-2nd" onClick={() => onClose && onClose()}>
                  Cancel
                </a>
              </div>
            </div>

            {placeBidShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidShowed(false)} />}
            {purchaseShowed && <PurchaseModal onClose={() => setPurchaseShowed(false)} />}
          </div>
        </Modal>
      )}
    </>
  );
};

export default PreviewModal;
