import React from 'react';
import dynamic from 'next/dynamic';
import styles from './CopyInstructionModal.module.scss';
import Image from 'next/image';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  onClose?: () => void;
}

const CopyInstructionModal: React.FC<IProps> = ({ onClose }: IProps) => {
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
              <div className={styles.title}>Bid or Purchase</div>

              <div className={styles.row}>
                <div>
                  First, select an NFT, get the NFT link by clicking on the "Share" button and{' '}
                  <strong>"Copy Link" button</strong> like this:
                </div>
                <p>&nbsp;</p>
                <div style={{ padding: 10, borderRadius: 6, border: '1px solid #eee' }}>
                  <Image alt="Instruction" src="/img/more/copy-instruction.png" width={500} height={320} />
                </div>
              </div>

              {/* <div className={styles.title}>Your price</div> */}

              {/* <div className={styles.row}>
                <ul>
                  <li>
                    <div>Your price</div>
                    <div>
                      <input type="number" autoFocus />
                    </div>
                    <div>ETH</div>
                  </li>
                </ul>
              </div> */}

              <div style={{ marginBottom: 20 }}>
                <input className="input-box" placeholder="https://... (paste NFT Link here...)" />
              </div>

              <div className={styles.footer}>
                <a className="action-btn">&nbsp;&nbsp;&nbsp; Bid &nbsp;&nbsp;&nbsp;</a>
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

export default CopyInstructionModal;
