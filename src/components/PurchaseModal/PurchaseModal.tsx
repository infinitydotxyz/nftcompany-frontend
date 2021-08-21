import React from 'react';
import dynamic from 'next/dynamic';
import styles from './PurchaseModal.module.scss';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  onClose?: () => void;
}

const PurchaseModal: React.FC<IProps> = ({ onClose }: IProps) => {
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
              <div className={styles.title}>Purchase Now</div>

              <div className={styles.row}>You are about to purchase this NFT.</div>

              <div className={styles.title}>Your price</div>

              <div className={styles.row}>Purchase Form</div>

              <div className={styles.footer}>
                <a className="action-btn">Approve</a>
                <a className="action-btn">Purchase</a>
                <a className="action-btn action-2nd" onClick={() => onClose && onClose()}>
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PurchaseModal;
