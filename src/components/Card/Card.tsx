import React, { useState, MouseEvent, useEffect } from 'react';
import PlaceBidModal from 'components/PlaceBidModal/PlaceBidModal';
import AcceptOfferModal from 'components/AcceptOfferModal/AcceptOfferModal';
import CancelOfferModal from 'components/CancelOfferModal/CancelOfferModal';
import { BaseCardData, CardData } from '@infinityxyz/lib/types/core';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { addressesEqual, getSearchFriendlyString } from 'utils/commonUtil';
import { useInView } from 'react-intersection-observer';
import router from 'next/router';
import { Spacer, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { LISTING_TYPE, PAGE_NAMES } from 'utils/constants';
import { NftAction } from 'types';
import styles from './CardList.module.scss';
import PreviewModal from 'components/PreviewModal/PreviewModal';
import AppLink from 'components/AppLink/AppLink';
import TransferNFTModal from 'components/TransferNFTModal/TransferNFTModal';
import { BsThreeDotsVertical, BsEye } from 'react-icons/bs';
import ListNFTModal from 'components/ListNFTModal/ListNFTModal';
import { CardPriceBox } from 'components/PriceBox/CardPriceBox';

type Props = {
  data: CardData;
  onClickAction?: (item: any, action: string) => any;
  showItems?: string[];
  action?: string;
  userAccount?: string;
  pageName?: string;
  [key: string]: any;
};

function Card({ data, onClickAction, userAccount, pageName, showItems = ['PRICE'], action = '' }: Props) {
  const [placeBidModalShowed, setPlaceBidModalShowed] = useState(false);
  const [acceptOfferModalShowed, setAcceptOfferModalShowed] = useState(false);
  const [cancelOfferModalShowed, setCancelOfferModalShowed] = useState(false);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '500px 0px 500px 0px' });
  const [order, setOrder] = useState<BaseCardData | undefined>();
  const [previewModalShowed, setPreviewModalShowed] = useState(false);
  const [relistModalShowed, setRelistModalShowed] = useState(false);
  const [transferModalShowed, setTransferModalShowed] = useState(false);

  useEffect(() => {
    // prefer infinity listings
    if (data.metadata?.basePriceInEth !== undefined) {
      setOrder(data);
    } else if (data.openseaListing?.metadata?.basePriceInEth !== undefined) {
      setOrder(data.openseaListing);
    }
  }, [data]);

  if (!data) {
    return null;
  }

  let ownedByYou = false;
  if (userAccount) {
    ownedByYou = addressesEqual(data.owner, userAccount);
  }

  const onClickCard = (ev: MouseEvent) => {
    router.push(`/assets/${data.tokenAddress}/${data.tokenId}`);
  };

  const collectionName = data.collectionName;
  const hasBlueCheck = data.hasBlueCheck;

  const actionButton = () => {
    const isForSale = data.metadata?.basePriceInEth;
    let handler: (ev: MouseEvent) => void = () => console.log('');
    let name;

    if (action === NftAction.ListNft) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (onClickAction) {
          onClickAction(data, NftAction.ListNft);
        }
      };
      name = 'List';
    } else if (action === NftAction.BuyNft && !ownedByYou) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setPlaceBidModalShowed(true);
      };
      name = isForSale ? 'Purchase' : 'Make Offer';
    } else if (action === NftAction.CancelListing) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (onClickAction) {
          onClickAction(data, NftAction.CancelListing);
        }
      };
      name = 'Cancel';
    } else if (action === NftAction.AcceptOffer) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setAcceptOfferModalShowed(true);
      };
      name = 'Accept';
    } else if (action === NftAction.CancelOffer) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setCancelOfferModalShowed(true);
      };
      name = 'Cancel';
    } else if (action === NftAction.ImportOrder) {
      handler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (onClickAction) {
          onClickAction(data, NftAction.ImportOrder);
        }
      };
      name = 'Import Listing';
    }

    if (name) {
      return (
        <MenuItem title={name} onClick={handler}>
          {name}
        </MenuItem>
      );
    }

    return null;
  };

  const shouldShowTransferButton =
    data.owner && userAccount && (data.owner ?? '').toLowerCase() === userAccount?.toLowerCase();

  const shouldShowOwnedByYou = ownedByYou && pageName === PAGE_NAMES.EXPLORE;

  const getToken = () => {
    if (data.chainId === '1') {
      return data?.order?.metadata?.listingType !== LISTING_TYPE.ENGLISH_AUCTION ? 'ETH' : 'WETH';
    }
    return 'WETH';
  };

  const menuEl = (
    <Menu>
      <MenuButton as={IconButton} aria-label="" icon={<BsThreeDotsVertical />} />
      <MenuList>
        {actionButton()}
        <MenuItem onClick={() => setRelistModalShowed(true)}>Relist / Lower Price</MenuItem>
        <MenuItem onClick={() => setTransferModalShowed(true)}>Transfer</MenuItem>
        <MenuItem onClick={() => setPreviewModalShowed(true)}>Preview</MenuItem>
      </MenuList>
    </Menu>
  );

  let mainLabel = '';
  if (pageName === PAGE_NAMES.MY_NFTS) {
    mainLabel = 'List';
  } else if (pageName === PAGE_NAMES.LISTED_NFTS) {
    mainLabel = 'Cancel';
  } else if (pageName === PAGE_NAMES.OFFERS_MADE) {
    mainLabel = 'Cancel';
  } else if (pageName === PAGE_NAMES.OFFERS_RECEIVED) {
    mainLabel = 'Accept';
  } else {
    mainLabel = 'Buy';
  }

  if (inView === false) {
    return (
      <div ref={ref} id={`id_${data.id}`} className={styles.card}>
        <img src={data.image} alt="Preloaded Image" style={{ width: 1, height: 1 }} />
      </div>
    );
  }
  return (
    <div ref={ref} id={`id_${data.id}`} className={styles.card}>
      <div className={styles.cardPreviewWrap}>
        <div className={styles.cardPreview} onClick={onClickCard}>
          <img src={data.image} alt="NFT image" />

          <div className={styles.cardControls}></div>
        </div>

        {shouldShowOwnedByYou && <div className={styles.ownedTag}>Owned</div>}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardLine}>
          <div className={styles.cardTitle}>
            {collectionName && (
              <div className={styles.collectionRow}>
                <AppLink title={collectionName} href={`/collection/${getSearchFriendlyString(collectionName)}`}>
                  {collectionName}
                </AppLink>

                <div style={{ paddingLeft: 6 }}>
                  <BlueCheckIcon hasBlueCheck={hasBlueCheck === true} />
                </div>
              </div>
            )}
            <div className={styles.title} title={data.title}>
              {data.title}
            </div>

            <div className={styles.priceRow}>
              <CardPriceBox
                label={mainLabel}
                price={showItems.indexOf('PRICE') >= 0 ? data.price : undefined}
                token={getToken()}
                expirationTime={data?.expirationTime}
                onClick={() => {
                  if (pageName === PAGE_NAMES.MY_NFTS && onClickAction) {
                    onClickAction(data, NftAction.ListNft);
                  } else if (pageName === PAGE_NAMES.LISTED_NFTS && onClickAction) {
                    onClickAction(data, NftAction.CancelListing);
                  } else if (pageName === PAGE_NAMES.OFFERS_MADE) {
                    setCancelOfferModalShowed(true);
                  } else if (pageName === PAGE_NAMES.OFFERS_RECEIVED) {
                    setAcceptOfferModalShowed(true);
                  } else {
                    setPlaceBidModalShowed(true);
                  }
                }}
              />

              {ownedByYou ? (
                menuEl
              ) : (
                <button onClick={() => setPreviewModalShowed(true)}>
                  <BsEye />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Spacer />

      <div className={styles.buttons}></div>

      {placeBidModalShowed && <PlaceBidModal data={data} onClose={() => setPlaceBidModalShowed(false)} />}
      {cancelOfferModalShowed && <CancelOfferModal data={data} onClose={() => setCancelOfferModalShowed(false)} />}
      {acceptOfferModalShowed && <AcceptOfferModal data={data} onClose={() => setAcceptOfferModalShowed(false)} />}
      {transferModalShowed && <TransferNFTModal data={data} onClose={() => setTransferModalShowed(false)} />}
      {previewModalShowed && (
        <PreviewModal
          action={action}
          data={data}
          onClose={() => {
            setPreviewModalShowed(false);
          }}
        />
      )}
      {relistModalShowed && <ListNFTModal data={data} onClose={() => setRelistModalShowed(false)} />}
    </div>
  );
}

export default Card;
