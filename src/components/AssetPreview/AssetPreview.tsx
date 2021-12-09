import React, { useEffect, useState } from 'react';
import styles from './AssetPreview.module.scss';
import { CardData } from 'types/Nft.interface';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PurchaseAccordion } from 'components/PurchaseAccordion/PurchaseAccordion';
import { getListings } from 'services/Listings.service';
import { defaultFilterState, ListingSource } from 'utils/context/SearchContext';
import { Link, Spacer, Box } from '@chakra-ui/react';
import { DescriptionBox } from 'components/PurchaseAccordion/DescriptionBox';
import { ExtraSpace } from 'components/Spacer/Spacer';
import NFTEvents from 'components/NFTEvents/NFTEvents';
import { getSearchFriendlyString } from 'utils/commonUtil';
import { TraitBox } from 'components/PurchaseAccordion/TraitBox';
import { NftAction } from 'types';

type Props = {
  tokenId: string;
  tokenAddress: string;
  onTitle: (title: string) => void;
};

export const AssetPreview = ({ tokenId, tokenAddress, onTitle }: Props): JSX.Element => {
  const [data, setData] = useState<CardData | undefined>();
  const [title, setTitle] = useState('');

  const action = NftAction.BuyNft;

  useEffect(() => {
    getCardData();
  }, []);

  const getCardData = async () => {
    const filter = defaultFilterState;

    filter.tokenAddress = tokenAddress;
    filter.tokenId = tokenId;

    const result = await getListings({ ...filter, listingSource: ListingSource.Infinity });

    if (result && result.length > 0) {
      let theData = result[0];
      let createdAt = theData.metadata?.createdAt ?? 0;

      // get the latest one if more than 1
      result.forEach((x) => {
        if ((x.metadata?.createdAt ?? 0) > createdAt) {
          theData = x;
          createdAt = x.metadata?.createdAt ?? 0;
        }
      });

      setData(theData);
      setTitle(theData.title);
      onTitle(theData.title);
    }
  };

  if (!data) {
    return <div />;
  }

  let name = getSearchFriendlyString(data?.collectionName || '');
  name = name?.toLowerCase();

  return (
    <>
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
                  <div className={styles.imgTitle}>{title}</div>
                  <div className={styles.collectionRow}>
                    <Link color="brandBlue" className={styles.collection} href={`${window.origin}/collection/${name}`}>
                      {data?.collectionName}
                    </Link>

                    <BlueCheckIcon large hasBlueCheck={data.hasBlueCheck === true} />
                  </div>
                </div>
                <Spacer />
                <div className={styles.playButton}>
                  {/* <Button
                    onClick={() => {
                      router.push('/game');
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
