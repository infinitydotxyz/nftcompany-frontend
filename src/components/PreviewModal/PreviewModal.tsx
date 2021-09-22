import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './PreviewModal.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { Link, Tooltip } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import ModalDialog from 'hooks/ModalDialog';
import { ellipsisAddress } from 'utils/commonUtil';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';

const isServer = typeof window === 'undefined';

interface Props {
  data: CardData;
  action: string; // 'purchase', 'accept-offer', 'cancel-offer'
  onClose: () => void;
}

const PreviewModal: React.FC<Props> = ({ action, onClose, data }: Props) => {
  const [placeBidShowed, setPlaceBidShowed] = useState(false);
  const [acceptOfferModalShowed, setAcceptOfferModalShowed] = useState(false);
  const [cancelOfferModalShowed, setCancelOfferModalShowed] = useState(false);
  const [listNFTModalShowed, setListNFTModalShowed] = useState(false);
  const [deleteListingModalShowed, setDeleteListingModalShowed] = useState(false);

  const { user } = useAppContext();

  let showPurchase = true;

  // show purchase with no price, we can look up any offers and buy and make offers
  //  || data.price == undefined) {
  if (data.owner == null || data.owner === user?.account) {
    showPurchase = false;
  }

  let offerMaker = '';
  let offerMakerShort = '';

  let owner = data.owner ?? '';
  if (owner.length > 16) {
    owner = ellipsisAddress(owner);
  }

  let tokenAddress = data.tokenAddress;
  if (tokenAddress != null) {
    if (tokenAddress.length > 16) {
      tokenAddress = ellipsisAddress(tokenAddress);
    }
  }

  let tokenId = data.tokenId;
  if (tokenId != null) {
    if (tokenId?.length > 16) {
      tokenId = ellipsisAddress(tokenId);
    }
  }

  let description = data.description;

  if (description == null || description?.length == 0) {
    description = 'none';
  }

  let purchaseButton;
  switch (action) {
    case 'CANCEL_LISTING':
      purchaseButton = (
        <a className="action-btn" onClick={() => setDeleteListingModalShowed(true)}>
          Cancel Listing
        </a>
      );

      break;
    case 'CANCEL_OFFER':
      purchaseButton = (
        <a className="action-btn" onClick={() => setCancelOfferModalShowed(true)}>
          Cancel Offer
        </a>
      );

      break;
    case 'ACCEPT_OFFER':
      offerMaker = data.maker ?? 'unkonwn';
      if (offerMaker.length > 16) {
        offerMakerShort = ellipsisAddress(offerMaker);
      }

      // hide the owner
      owner = '';

      purchaseButton = (
        <a className="action-btn" onClick={() => setAcceptOfferModalShowed(true)}>
          Accept Offer
        </a>
      );
      break;
    case 'LIST_NFT':
      purchaseButton = (
        <a className="action-btn" onClick={() => setListNFTModalShowed(true)}>
          List NFT
        </a>
      );
      break;
    case 'VIEW_ORDER':
      break;
    case 'BUY_NFT':
    default:
      // not even sure I need this if statement, SNG remove later
      if (showPurchase) {
        purchaseButton = (
          <a className="action-btn" onClick={() => setPlaceBidShowed(true)}>
            Purchase
          </a>
        );
      }
      break;
  }

  const _ownerSection =
    owner?.length > 0 ? (
      <>
        <div className={styles.label}>Owner</div>
        <Tooltip label={data.owner} hasArrow openDelay={1000}>
          <Link color="brandBlue" href={`${window.origin}/${data.owner}`} target="_blank" rel="noreferrer">
            {owner}
          </Link>
        </Tooltip>
      </>
    ) : null;

  const _offerMakerSection =
    offerMaker?.length > 0 ? (
      <>
        <div className={styles.label}>Offer Maker</div>
        <Tooltip label={offerMaker} hasArrow openDelay={1000}>
          <Link color="brandBlue" href={`${window.origin}/${offerMaker}`} target="_blank" rel="noreferrer">
            {offerMakerShort}
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
                    {_offerMakerSection}

                    <span className={styles.label}>Description</span>
                    <div className={styles.description}>{description}</div>

                    <div className={styles.buttons}>{purchaseButton}</div>
                  </div>
                </div>
              </div>
            </div>

            {deleteListingModalShowed && (
              <CancelListingModal data={data} onClose={() => setDeleteListingModalShowed(false)} />
            )}

            {placeBidShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidShowed(false)} />}
            {cancelOfferModalShowed && (
              <CancelOfferModal data={data} onClose={() => setCancelOfferModalShowed(false)} />
            )}
            {listNFTModalShowed && <ListNFTModal data={data} onClose={() => setListNFTModalShowed(false)} />}
            {acceptOfferModalShowed && (
              <AcceptOfferModal data={data} onClose={() => setAcceptOfferModalShowed(false)} />
            )}
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default PreviewModal;
