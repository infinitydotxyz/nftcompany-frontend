import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './scss/PreviewInfo.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { Button, Link, Spacer, Tooltip } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { addressesEqual, ellipsisAddress, ellipsisString, getToken, toChecksumAddress } from 'utils/commonUtil';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { Label } from 'components/Text/Text';
import { CopyButton } from 'components/CopyButton/CopyButton';

interface Props {
  data: CardData;
  action: string;
  showDescription?: boolean;
  onComplete: () => void;
}

export const PreviewInfo: React.FC<Props> = ({ showDescription = false, action, data }: Props) => {
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

  if (description && description.length > 300) {
    description = `${description.slice(0, 300)}...`;
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
      // handled in the accordion
      break;
  }

  const _ownerSection =
    owner?.length > 0 ? (
      <div className={styles.addressRow}>
        <Label text="Owner:" />
        <Spacer />
        <Tooltip label={toChecksumAddress(data.owner)} hasArrow openDelay={1000}>
          <Link
            className={styles.link}
            color="brandBlue"
            href={`${window.origin}/${data.owner}`}
            target="_blank"
            rel="noreferrer"
          >
            {owner}
          </Link>
        </Tooltip>

        <CopyButton copyText={data.owner} />
      </div>
    ) : null;

  const _offerMakerSection =
    offerMaker?.length > 0 ? (
      <div className={styles.addressRow}>
        <Label text="Offer Maker:" />
        <Spacer />
        <Tooltip label={toChecksumAddress(offerMaker)} hasArrow openDelay={1000}>
          <Link
            className={styles.link}
            color="brandBlue"
            href={`${window.origin}/${offerMaker}`}
            target="_blank"
            rel="noreferrer"
          >
            {offerMakerShort}
          </Link>
        </Tooltip>

        <CopyButton copyText={offerMaker} />
      </div>
    ) : null;

  const _tokenAddressSection = (
    <div className={styles.addressRow}>
      <Label text="Token Address:" />

      <Spacer />
      <Tooltip label={toChecksumAddress(data.tokenAddress)} hasArrow openDelay={1000}>
        <Link
          className={styles.link}
          color="brandBlue"
          href={`https://etherscan.io/token/${data.tokenAddress}`}
          target="_blank"
          rel="noreferrer"
        >
          {tokenAddress}
        </Link>
      </Tooltip>
      <CopyButton copyText={data.tokenAddress} />
    </div>
  );

  const _tokenIdSection = (
    <div className={styles.addressRow}>
      <Label text="Token Id:" />

      <Spacer />

      <Tooltip label={data.tokenId} hasArrow openDelay={1000}>
        <Link
          className={styles.link}
          color="brandBlue"
          href={`https://etherscan.io/token/${data.tokenAddress}?a=${data.tokenId}`}
          target="_blank"
          rel="noreferrer"
        >
          {tokenId}
        </Link>
      </Tooltip>
      <CopyButton copyText={data.tokenId} />
    </div>
  );

  const _descriptionSection = description ? (
    <>
      <div className={styles.addressRow}>
        <Label text="Description" />
      </div>
      <div className={styles.description}>{description}</div>
    </>
  ) : null;

  const paymentToken = getToken(data?.order?.paymentToken);
  const _priceSection = data.price ? (
    <div className={styles.priceRow}>
      <Label text={paymentToken === 'WETH' ? 'Minimum Price:' : 'Price:'} />

      <Spacer />
      <PriceBox justifyRight price={data?.price} token={paymentToken} expirationTime={data?.expirationTime} />
    </div>
  ) : null;

  return (
    <div>
      <div className={styles.infoBox}>
        {_priceSection}
        {_tokenAddressSection}
        {_tokenIdSection}
        {_ownerSection}
        {_offerMakerSection}

        {showDescription && _descriptionSection}

        {purchaseButton && <div className={styles.buttons}>{purchaseButton}</div>}
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
