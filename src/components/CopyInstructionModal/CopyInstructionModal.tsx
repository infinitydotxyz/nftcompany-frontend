import React from 'react';
import dynamic from 'next/dynamic';
import styles from './CopyInstructionModal.module.scss';
import Image from 'next/image';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  onClickMakeOffer?: (nftLink: string, price: number) => void;
  onClickBuyNow?: (nftLink: string, price: number) => void;
  onClickListNFT?: (nftLink: string, price: number) => void;
  onClose?: () => void;
}

const CopyInstructionModal: React.FC<IProps> = ({ onClickListNFT, onClickMakeOffer, onClickBuyNow, onClose }: IProps) => {
  const [nftLink, setNftLink] = React.useState('');
  const [price, setPrice] = React.useState(0);
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
              <div className={styles.title}>Make Offer</div>

              <div className={styles.row}>
                <div>
                  First, select an NFT, then get the NFT link by clicking on the &quot;Share&quot; button and{' '}
                  <strong>&quot;Copy Link&quot; button</strong> like this screenshot:
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

              <div style={{ marginBottom: 10 }}>
                <div>Paste the NFT link here:</div>
                <input className="input-box" onChange={(ev) => setNftLink(ev.target.value)} placeholder="https://... (NFT Link)" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div>Price: (ETH)</div>
                <input className="input-box" type="number" onChange={(ev) => setPrice(parseFloat(ev.target.value))} />
              </div>

              <div className={styles.footer}>
                <a className="action-btn" onClick={() => onClickListNFT && onClickListNFT(nftLink, price)}>
                  &nbsp;&nbsp;&nbsp; List NFT &nbsp;&nbsp;&nbsp;
                </a>
                <a className="action-btn" onClick={() => onClickMakeOffer && onClickMakeOffer(nftLink, price)}>
                  &nbsp;&nbsp;&nbsp; Make Offer &nbsp;&nbsp;&nbsp;
                </a>
                <a className="action-btn" onClick={() => onClickBuyNow && onClickBuyNow(nftLink, price)}>
                  &nbsp;&nbsp;&nbsp; Buy Now &nbsp;&nbsp;&nbsp;
                </a>

                {/* <a className="action-btn">Buy Now</a> */}
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
