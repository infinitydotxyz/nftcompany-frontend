import React, { useState } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import styles from './scss/PreviewInfo.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { Button, Spacer } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { addressesEqual, getToken, toChecksumAddress } from 'utils/commonUtil';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { Label } from 'components/Text/Text';
import { ShortAddress } from 'components/ShortAddress/ShortAddress';
import { CHAIN_SCANNER_BASE } from 'utils/constants';

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
  let owner = data.owner ?? '';
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
      break;
    case 'ACCEPT_OFFER':
      offerMaker = data.maker ?? 'unkonwn';

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
      href={`${CHAIN_SCANNER_BASE}/token/${data.tokenAddress}`}
      label="Token Address:"
      tooltip={toChecksumAddress(data.tokenAddress)}
    />
  );

  const _tokenIdSection = (
    <ShortAddress
      address={data.tokenId}
      href={`${CHAIN_SCANNER_BASE}/token/${data.tokenAddress}?a=${data.tokenId}`}
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

  const paymentToken = getToken(data?.order?.paymentToken);
  const _priceSection = data.metadata?.basePriceInEth ? (
    <div className={styles.priceRow}>
      <Label text={paymentToken === 'WETH' ? 'Minimum Price:' : 'Price:'} />

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
