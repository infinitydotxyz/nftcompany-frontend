import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './PreviewModal.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { Button, Link, Tooltip } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { addressesEqual, ellipsisAddress, ellipsisString, getToken, toChecksumAddress } from 'utils/commonUtil';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { WETH_ADDRESS } from 'utils/constants';
import { PurchaseAccordion } from 'components/PurchaseAccordion/PurchaseAccordion';

const isServer = typeof window === 'undefined';

interface Props {
  data: CardData;
  action: string; // 'purchase', 'accept-offer', 'cancel-offer'
  onClose: () => void;
}

const PreviewModal: React.FC<Props> = ({ action, onClose, data }: Props) => {
  const { user } = useAppContext();

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div style={{ width: '80vw', maxWidth: 1000 }}>
            <div className={styles.main}>
              <div className={styles.nftContent}>
                <div className={styles.left}>
                  <img
                    alt="not available"
                    src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
                  />
                </div>

                <div className={styles.right}>
                  <div className={styles.collectionRow}>
                    <div className={styles.collection}>{data?.collectionName}</div>
                    <BlueCheckIcon hasBlueCheck={data.hasBlueCheck === true} />
                  </div>

                  <div className={styles.title}>{data?.title}</div>

                  <PurchaseAccordion
                    data={data}
                    action={action}
                    onComplete={() => {
                      onClose();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default PreviewModal;
