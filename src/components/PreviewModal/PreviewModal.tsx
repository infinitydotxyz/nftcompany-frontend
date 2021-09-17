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
              <div className={styles.title}>{data?.title}</div>

              <div className={styles.space}>{data?.collectionName}</div>

              <div className={styles.main}>
                <div className={styles.imgBox}>
                  <img
                    src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
                  />
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.price}>{data?.price} ETH</div>
                  <div className={styles.counter}>{data.inStock ?? 0} in stock</div>
                  <div className={styles.description}>{data?.description}</div>

                  {/* tokenAddress: item.asset_contract.address, tokenId: item.token_id, */}
                </div>
              </div>

              <div className={styles.buttons}>
                <a className="action-btn  " onClick={() => setPlaceBidShowed(true)}>
                  Make an offer
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
