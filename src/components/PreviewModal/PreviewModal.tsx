import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './PreviewModal.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { Button } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { addressesEqual, getChainScannerBase, getToken, toChecksumAddress } from 'utils/commonUtil';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { ExternalLinkIconButton, ShareIconButton } from 'components/ShareButton/ShareButton';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { Label } from 'components/Text/Text';
import { LISTING_TYPE } from 'utils/constants';
import { NftAction } from 'types';

const isServer = typeof window === 'undefined';

interface Props {
  data: CardData;
  action: string; // 'purchase', 'accept-offer', 'cancel-offer'
  previewCollection?: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<Props> = ({ action, onClose, data, previewCollection }: Props) => {
  const [placeBidShowed, setPlaceBidShowed] = useState(false);
  const [acceptOfferModalShowed, setAcceptOfferModalShowed] = useState(false);
  const [cancelOfferModalShowed, setCancelOfferModalShowed] = useState(false);
  const [listNFTModalShowed, setListNFTModalShowed] = useState(false);
  const [deleteListingModalShowed, setDeleteListingModalShowed] = useState(false);

  const { user } = useAppContext();

  let showPurchase = true;

  if (!data.owner || addressesEqual(data.owner, user?.account)) {
    showPurchase = false;
  }

  let offerMaker = '';

  let owner = data.owner ?? '';

  let description = data.description;

  if (!description || description?.length === 0) {
    description = 'none';
  }

  let purchaseButton;
  switch (action) {
    case NftAction.CancelListing:
      purchaseButton = <Button onClick={() => setDeleteListingModalShowed(true)}>Cancel Listing</Button>;

      // hide the owner
      owner = '';

      break;
    case NftAction.CancelOffer:
      purchaseButton = <Button onClick={() => setCancelOfferModalShowed(true)}>Cancel Offer</Button>;

      // change to owner of asset
      owner = data.metadata?.asset.owner ?? '';

      break;
    case NftAction.AcceptOffer:
      offerMaker = data.maker ?? 'unkonwn';

      // hide the owner
      owner = '';

      purchaseButton = <Button onClick={() => setAcceptOfferModalShowed(true)}>Accept Offer</Button>;
      break;
    case NftAction.ListNft:
      purchaseButton = <Button onClick={() => setListNFTModalShowed(true)}>List NFT</Button>;
      break;
    case NftAction.ViewOrder:
      // hide the owner
      owner = '';

      break;
    case NftAction.BuyNft:
    default:
      // not even sure I need this if statement, SNG remove later
      if (showPurchase) {
        purchaseButton = <Button onClick={() => setPlaceBidShowed(true)}>Purchase</Button>;
      }
      break;
  }

  const _ownerSection =
    owner?.length > 0 ? (
      <ShortAddress
        vertical={true}
        address={owner}
        href={`${window.origin}/${owner}`}
        label="Owner"
        tooltip={toChecksumAddress(owner)}
      />
    ) : null;

  const _offerMakerSection =
    offerMaker?.length > 0 ? (
      <ShortAddress
        vertical={true}
        address={offerMaker}
        href={`${window.origin}/${offerMaker}`}
        label="Offer Maker"
        tooltip={toChecksumAddress(offerMaker)}
      />
    ) : null;

  const _buttonBar = (
    <div className={styles.buttonBar}>
      <ShareIconButton copyText={`${window.origin}/assets/${data.tokenAddress}/${data.tokenId}`} tooltip="Copy Link" />

      <ExternalLinkIconButton
        url={`${window.origin}/assets/${data.tokenAddress}/${data.tokenId}`}
        tooltip="Open Link"
      />
    </div>
  );

  const paymentToken = getToken(data.order?.metadata?.listingType, data.order?.metadata?.chainId);
  const listingType = data?.order?.metadata?.listingType;
  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div style={{ width: '80vw', maxWidth: 1000 }}>
            <div className={styles.main}>
              <div className={styles.nftContent}>
                <div className={styles.imgBox}>
                  <img
                    alt="not available"
                    src={
                      data.image ||
                      data.cardImage ||
                      'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'
                    }
                  />
                </div>

                <div className={styles.infoBox}>
                  <div className={styles.collectionRow}>
                    <div className={styles.collection}>{data?.collectionName || data?.name}</div>

                    <BlueCheckIcon hasBlueCheck={data.hasBlueCheck === true} />
                  </div>

                  {previewCollection !== true && <div className={styles.title}>{data?.title}</div>}

                  {previewCollection === true ? null : _buttonBar}

                  {data.metadata?.basePriceInEth && (
                    <>
                      <Label bold mt text={listingType === LISTING_TYPE.ENGLISH_AUCTION ? 'Minimum Price' : 'Price'} />

                      <PriceBox
                        price={data.metadata?.basePriceInEth}
                        token={paymentToken}
                        expirationTime={data?.expirationTime}
                      />
                    </>
                  )}

                  <ShortAddress
                    vertical={true}
                    address={data.tokenAddress}
                    href={`${getChainScannerBase(data.chainId)}/token/${data.tokenAddress}`}
                    label="Contract Address"
                    tooltip={toChecksumAddress(data.tokenAddress)}
                  />

                  <ShortAddress
                    vertical={true}
                    address={data.tokenId}
                    href={`${getChainScannerBase(data.chainId)}/token/${data.tokenAddress}?a=${data.tokenId}`}
                    label="Token Id"
                    tooltip={data.tokenId}
                  />

                  {_ownerSection}
                  {_offerMakerSection}

                  {previewCollection === true ? <span>&nbsp;</span> : <Label bold mt text="Description" />}

                  <Label text={description} />

                  {/* <div className={styles.buttons}>{purchaseButton}</div> */}
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
