import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from 'containers/layout';
import pageStyles from '../../styles/Dashboard.module.scss';
import BidBox from 'components/BidBox/BidBox';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import PurchaseModal from 'components/PurchaseModal/PurchaseModal';
import { getOpenSeaport } from 'utils/ethersUtil';

import dynamic from 'next/dynamic';
import styles from './PreviewModal.module.scss';
import Datetime from 'react-datetime';
import { CardData } from 'components/Card/Card';
import { showMessage } from 'utils/commonUtil';
import { useToast } from '@chakra-ui/react';
import { useAppContext } from 'utils/context/AppContext';
const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  data: CardData;
  onClose?: () => void;
}

const PreviewModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [offerPrice, setOfferPrice] = React.useState(0);
  const toast = useToast();
  const { user } = useAppContext();
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
              <div className={styles.title}>Buy NFT</div>

              <div className={styles.space}>You are about to buy this NFT.</div>

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

                  {placeBidShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidShowed(false)} />}
                  {purchaseShowed && <PurchaseModal onClose={() => setPurchaseShowed(false)} />}
                </section>
              </div>

              <div className={styles.footer}>
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

export default PreviewModal;
