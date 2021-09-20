import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import dynamic from 'next/dynamic';
import styles from './PreviewModal.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { Link, Tooltip } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import ModalDialog from 'hooks/ModalDialog';
const isServer = typeof window === 'undefined';

interface Props {
  data: CardData;
  onClose: () => void;
}

const PreviewModal: React.FC<Props> = ({ onClose, data }: Props) => {
  const [placeBidShowed, setPlaceBidShowed] = useState(false);
  const { user } = useAppContext();

  let showPurchase = true;

  if (data.owner == null || data.owner === user?.account || data.price == undefined) {
    showPurchase = false;
  }

  let owner = data.owner ?? '';
  if (owner.length > 16) {
    owner = `${owner.slice(0, 6)}...${owner.slice(-4)}`;
  }

  let tokenAddress = data.tokenAddress;
  if (tokenAddress != null) {
    if (tokenAddress.length > 16) {
      tokenAddress = `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`;
    }
  }

  let tokenId = data.tokenId;
  if (tokenId != null) {
    if (tokenId?.length > 16) {
      tokenId = `${tokenId.slice(0, 4)}...${tokenId.slice(-4)}`;
    }
  }

  let description = data.description;

  if (description == null || description?.length == 0) {
    description = 'none';
  }

  let _ownerSection =
    owner.length > 0 ? (
      <>
        <div className={styles.label}>Owner</div>
        <Tooltip label={data.tokenAddress} hasArrow openDelay={1000}>
          <Link color="brandBlue" href={`${window.origin}/${data.owner}`} target="_blank" rel="noreferrer">
            {owner}
          </Link>
        </Tooltip>
      </>
    ) : null;

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div
            className={`modal ${'ntfmodal'}`}
            style={{ width: '80vw', maxWidth: 1000, background: 'white', borderColor: 'white' }}
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

                    {data.price != undefined && (
                      <>
                        <span className={styles.label}>Price</span>

                        <PriceBox price={data?.price} />
                      </>
                    )}

                    <div className={styles.label}>Token Address</div>
                    <Tooltip label={data.tokenAddress} hasArrow openDelay={1000}>
                      <Link
                        color="brandBlue"
                        href={`https://etherscan.io/token/${data.tokenAddress}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {tokenAddress}
                      </Link>
                    </Tooltip>

                    <div className={styles.label}>Token Id</div>

                    <Tooltip label={data.tokenId} hasArrow openDelay={1000}>
                      <Link
                        color="brandBlue"
                        href={`https://etherscan.io/token/${data.tokenAddress}?a=${data.tokenId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {tokenId}
                      </Link>
                    </Tooltip>

                    {_ownerSection}

                    <span className={styles.label}>Description</span>
                    <div className={styles.description}>{description}</div>

                    <div className={styles.buttons}>
                      {showPurchase && (
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
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default PreviewModal;
