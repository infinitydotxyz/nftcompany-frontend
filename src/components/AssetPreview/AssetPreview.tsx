import React, { useEffect, useState } from 'react';
import styles from './AssetPreview.module.scss';
import { CardData, BaseCardData } from '@infinityxyz/lib/types/core';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PurchaseAccordion } from 'components/PurchaseAccordion/PurchaseAccordion';
import { getListings } from 'services/Listings.service';
import { defaultFilterState, ListingSource } from 'utils/context/SearchContext';
import { Spacer, Box } from '@chakra-ui/react';
import { DescriptionBox } from 'components/PurchaseAccordion/DescriptionBox';
import { ExtraSpace } from 'components/Spacer/Spacer';
import NFTEvents from 'components/NFTEvents/NFTEvents';
import { getSearchFriendlyString } from 'utils/commonUtil';
import { TraitBox } from 'components/PurchaseAccordion/TraitBox';
import { NftAction } from 'types';
import AppLink from 'components/AppLink/AppLink';
import { useAppContext } from 'utils/context/AppContext';

type Props = {
  tokenId: string;
  tokenAddress: string;
  onTitle: (title: string) => void;
};

export const AssetPreview = ({ tokenId, tokenAddress, onTitle }: Props): JSX.Element => {
  const [data, setData] = useState<CardData | undefined>();
  const [listings, setListings] = useState<BaseCardData[]>([]);
  const [title, setTitle] = useState('');
  const { chainId } = useAppContext();

  const action = NftAction.BuyNft;

  useEffect(() => {
    getCardData();
  }, []);

  const getCardData = async () => {
    const filter = defaultFilterState;

    filter.tokenAddress = tokenAddress;
    filter.tokenId = tokenId;

    const result = await getListings({ ...filter, chainId, listingSource: ListingSource.Infinity });

    if (result && result.length > 0) {
      setListings(result);
      let firstListing = result[0]; // by default, pick the first (latest) listing.
      let createdAt = firstListing.metadata?.createdAt ?? 0;

      // get the latest one if more than 1
      result.forEach((x) => {
        if ((x.metadata?.createdAt ?? 0) > createdAt) {
          firstListing = x;
          createdAt = x.metadata?.createdAt ?? 0;
        }
      });

      setData(firstListing);
      setTitle(firstListing.title);
      onTitle(firstListing.title);
    }
  };

  if (!data) {
    return <div />;
  }

  let name = getSearchFriendlyString(data?.collectionName || '');
  name = name?.toLowerCase();

  return (
    <>
      <h1 className="text-7xl font-bold underline">Hello world!</h1>
      <div className={styles.main}>
        <div className={styles.nftContent}>
          <div className={styles.left}>
            <div className={styles.imageFrame}>
              <img
                alt="not available"
                src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
              />

              <div className={styles.imgFooter}>
                <div className={styles.infoColumn}>
                  <div className={styles.collectionRow}>
                    <AppLink
                      type="secondary"
                      className={styles.collection}
                      href={`${window.origin}/collection/${name}`}
                    >
                      {data?.collectionName}
                    </AppLink>

                    <BlueCheckIcon large hasBlueCheck={data.hasBlueCheck === true} />
                  </div>
                  <div className={styles.imgTitle}>{title}</div>
                </div>
                <Spacer />
                <div className={styles.playButton}>
                  {/* <Button
                    onClick={() => {
                      router.push('/game/doge2048');
                    }}
                  >
                    Play Game
                  </Button> */}
                </div>
              </div>
            </div>

            <ExtraSpace />

            <DescriptionBox data={data} />

            {(data.metadata?.asset?.traits || []).length > 0 && (
              <Box mt={4}>
                <TraitBox data={data} />
              </Box>
            )}
          </div>

          <div className={styles.right}>
            <PurchaseAccordion
              data={data}
              listings={listings}
              action={action}
              onComplete={() => {
                // onClose();
              }}
            />
          </div>
        </div>

        <NFTEvents address={tokenAddress} tokenId={tokenId} />
      </div>
    </>
  );
};
