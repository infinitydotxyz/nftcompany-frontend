import React from 'react';
import dynamic from 'next/dynamic';
import styles from './PlaceBidModal.module.scss';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  onClose?: () => void;
}

const PlaceBidModal: React.FC<IProps> = ({ onClose }: IProps) => {
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
              <div className={styles.title}>Place a bid</div>

              <div className={styles.row}>You are about to place a bid on this NFT.</div>

              <div className={styles.title}>Your bid</div>

              <div className={styles.row}>Bid Form</div>

              <div className={styles.footer}>
                <a className="action-btn">Approve</a>
                <a className="action-btn">Place a bid</a>
                <a className="action-btn action-2nd">Cancel</a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PlaceBidModal;
