import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './scss/PreviewInfo.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { Button, Spacer } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { addressesEqual, getChainScannerBase, getToken, toChecksumAddress } from 'utils/commonUtil';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { Label } from 'components/Text/Text';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { LISTING_TYPE } from 'utils/constants';
import { NftAction } from 'types';

interface Props {
  data: CardData;
  action: NftAction;
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
  let owner = data.owner ?? '';
  let description = data.description;

  if (description && description.length > 300) {
    description = `${description.slice(0, 300)}...`;
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
      // handled in the accordion
      break;
  }

  const _ownerSection =
    owner?.length > 0 ? (
      <ShortAddress
        address={owner}
        href={`${window.origin}/${owner}`}
        label="Owner:"
        tooltip={toChecksumAddress(owner)}
      />
    ) : null;

  const _offerMakerSection =
    offerMaker?.length > 0 ? (
      <ShortAddress
        address={offerMaker}
        href={`${window.origin}/${offerMaker}`}
        label="Offer Maker:"
        tooltip={toChecksumAddress(offerMaker)}
      />
    ) : null;

  const _tokenAddressSection = (
    <ShortAddress
      address={data.tokenAddress}
      href={`${getChainScannerBase(data.chainId)}/token/${data.tokenAddress}`}
      label="Contract Address:"
      tooltip={toChecksumAddress(data.tokenAddress)}
    />
  );

  const _tokenIdSection = (
    <ShortAddress
      address={data.tokenId}
      href={`${getChainScannerBase(data.chainId)}/token/${data.tokenAddress}?a=${data.tokenId}`}
      label="Token Id:"
      tooltip={data.tokenId}
    />
  );

  const _descriptionSection = description ? (
    <>
      <div className={styles.addressRow}>
        <Label text="Description" />
      </div>
      <div className={styles.description}>{description}</div>
    </>
  ) : null;

  const paymentToken = getToken(data.order?.metadata?.listingType, data.order?.metadata?.chainId);
  const listingType = data?.order?.metadata?.listingType;
  const _priceSection = data.metadata?.basePriceInEth ? (
    <div className={styles.priceRow}>
      <Label text={listingType === LISTING_TYPE.ENGLISH_AUCTION ? 'Minimum Price:' : 'Price:'} />

      <Spacer />
      <PriceBox
        justifyRight
        price={data.metadata?.basePriceInEth}
        token={paymentToken}
        expirationTime={data?.expirationTime}
      />
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
