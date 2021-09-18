import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import PurchaseModal from 'components/PurchaseModal/PurchaseModal';
import dynamic from 'next/dynamic';
import styles from './PreviewModal.module.scss';
import { CardData } from 'components/Card/Card';
import { useAppContext } from 'utils/context/AppContext';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface Props {
  data: CardData;
  onClose?: () => void;
}

const PreviewModal: React.FC<Props> = ({ onClose, data }: Props) => {
  const [placeBidShowed, setPlaceBidShowed] = useState(false);
  const [purchaseShowed, setPurchaseShowed] = useState(false);
  const { user } = useAppContext();

  let ownedByYou = false;

  if (data.owner == null || data.owner === user?.account) {
    ownedByYou = true;
  }

  let tokenAddress = data.tokenAddress;
  if (tokenAddress != null) {
    if (tokenAddress?.length > 16) {
      tokenAddress = `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`;
    }
  }

  let tokenId = data.tokenId;
  if (tokenId != null) {
    if (tokenId?.length > 16) {
      tokenId = `${tokenId.slice(0, 6)}...${tokenId.slice(-4)}`;
    }
  }

  let description = data.description;

  if (description == null || description?.length == 0) {
    description = 'none';
  }

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
          <div
            className={`modal ${'ntfmodal'}`}
            style={{ width: '80vw', maxWidth: 1000, background: 'white', borderColor: 'blue' }}
          >
            <div className="modal-body">
              <div className={styles.main}>
                <div className={styles.nftContent}>
                  <div className={styles.imgBox}>
                    <img
                      alt="not available"
                      src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
                    />
                  </div>

                  <div className={styles.infoBox}>
                    <div className={styles.collectionRow}>
                      <div className={styles.collection}>{data?.collectionName}</div>

                      <BlueCheckIcon hasBlueCheck={data.hasBlueCheck === true} />
                    </div>

                    <div className={styles.title}>{data?.title}</div>

                    <span className={styles.label}>Price</span>

                    <div className={styles.price}>{data?.price} ETH</div>

                    <div className={styles.label}>Token Address</div>
                    <a
                      href={`https://etherscan.io/token/${data.tokenAddress}`}
                      className={styles.tokenAddress}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {tokenAddress}
                    </a>

                    <div className={styles.label}>Token Id</div>
                    <a
                      href={`https://etherscan.io/token/${data.tokenAddress}?a=${data.tokenId}`}
                      className={styles.tokenId}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {tokenId}
                    </a>

                    <span className={styles.label}>Description</span>
                    <div className={styles.description}>{description}</div>

                    <div className={styles.buttons}>
                      {!ownedByYou && (
                        <a className="action-btn" onClick={() => setPlaceBidShowed(true)}>
                          Purchase
                        </a>
                      )}
                    </div>
                  </div>
                </div>
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
