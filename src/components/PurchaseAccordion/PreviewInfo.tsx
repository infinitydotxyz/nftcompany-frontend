import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './PreviewModal.module.scss';
import { CardData, Order } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { Button, Link, Tooltip } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { addressesEqual, ellipsisAddress, ellipsisString, getToken, toChecksumAddress } from 'utils/commonUtil';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { PurchaseAccordion } from 'components/PurchaseAccordion/PurchaseAccordion';

interface Props {
  data: CardData;
  action: string;
  onComplete: () => void;
}

export const PreviewInfo: React.FC<Props> = ({ action, data }: Props) => {
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
  let offerMakerShort = '';

  let owner = data.owner ?? '';
  owner = ellipsisAddress(owner);

  if (addressesEqual(data.owner, user?.account)) {
    owner = 'You';
  }

  let tokenAddress = data.tokenAddress;
  if (tokenAddress) {
    tokenAddress = ellipsisAddress(tokenAddress);
  }

  let tokenId = data.tokenId;
  if (tokenId) {
    tokenId = ellipsisString(tokenId);
  }

  let description = data.description;

  if (!description || description?.length === 0) {
    description = 'none';
  }

  let purchaseButton;
  switch (action) {
    case 'CANCEL_LISTING':
      purchaseButton = <Button onClick={() => setDeleteListingModalShowed(true)}>Cancel Listing</Button>;

      // hide the owner
      owner = '';

      break;
    case 'CANCEL_OFFER':
      purchaseButton = <Button onClick={() => setCancelOfferModalShowed(true)}>Cancel Offer</Button>;

      // change to owner of asset
      owner = data.metadata?.asset.owner ?? '';
      owner = ellipsisAddress(owner);

      break;
    case 'ACCEPT_OFFER':
      offerMaker = data.maker ?? 'unkonwn';
      if (offerMaker.length > 16) {
        offerMakerShort = ellipsisAddress(offerMaker);
      }

      // hide the owner
      owner = '';

      purchaseButton = <Button onClick={() => setAcceptOfferModalShowed(true)}>Accept Offer</Button>;
      break;
    case 'LIST_NFT':
      purchaseButton = <Button onClick={() => setListNFTModalShowed(true)}>List NFT</Button>;
      break;
    case 'VIEW_ORDER':
      // hide the owner
      owner = '';

      break;
    case 'BUY_NFT':
    default:
      // not even sure I need this if statement, SNG remove later
      if (showPurchase) {
        purchaseButton = (
          <PurchaseAccordion
            data={data}
            action={action}
            onComplete={() => {
              console.log('done');
            }}
          />
        );

        // purchaseButton = <Button onClick={() => setPlaceBidShowed(true)}>Purchase</Button>;
      }
      break;
  }

  const _ownerSection =
    owner?.length > 0 ? (
      <>
        <div className={styles.label}>Owner</div>
        <Tooltip label={toChecksumAddress(data.owner)} hasArrow openDelay={1000}>
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
        <Tooltip label={toChecksumAddress(offerMaker)} hasArrow openDelay={1000}>
          <Link color="brandBlue" href={`${window.origin}/${offerMaker}`} target="_blank" rel="noreferrer">
            {offerMakerShort}
          </Link>
        </Tooltip>
      </>
    ) : null;

  const _tokenAddressSection = (
    <>
      <div className={styles.label}>Token Address</div>
      <Tooltip label={toChecksumAddress(data.tokenAddress)} hasArrow openDelay={1000}>
        <Link
          color="brandBlue"
          href={`https://etherscan.io/token/${data.tokenAddress}`}
          target="_blank"
          rel="noreferrer"
        >
          {tokenAddress}
        </Link>
      </Tooltip>
    </>
  );

  const _tokenIdSection = (
    <>
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
    </>
  );

  const paymentToken = getToken(data?.order?.paymentToken);
  const _priceSection = data.price ? (
    <>
      <span className={styles.label}>{paymentToken === 'WETH' ? 'Minimum Price' : 'Price'}</span>

      <PriceBox price={data?.price} token={paymentToken} expirationTime={data?.expirationTime} />
    </>
  ) : null;

  return (
    <div>
      <div className={styles.infoBox}>
        <div className={styles.collectionRow}>
          <div className={styles.collection}>{data?.collectionName}</div>
          <BlueCheckIcon hasBlueCheck={data.hasBlueCheck === true} />
        </div>

        <div className={styles.title}>{data?.title}</div>

        {_priceSection}
        {_tokenAddressSection}
        {_tokenIdSection}
        {_ownerSection}
        {_offerMakerSection}

        <span className={styles.label}>Description</span>
        <div className={styles.description}>{description}</div>

        <div className={styles.buttons}>{purchaseButton}</div>
      </div>

      {deleteListingModalShowed && (
        <CancelListingModal data={data} onClose={() => setDeleteListingModalShowed(false)} />
      )}

      {placeBidShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidShowed(false)} />}
      {cancelOfferModalShowed && <CancelOfferModal data={data} onClose={() => setCancelOfferModalShowed(false)} />}
      {listNFTModalShowed && <ListNFTModal data={data} onClose={() => setListNFTModalShowed(false)} />}
      {acceptOfferModalShowed && <AcceptOfferModal data={data} onClose={() => setAcceptOfferModalShowed(false)} />}
    </div>
  );
};
