import React, { useEffect, useState } from 'react';
import styles from './AssetPreview.module.scss';
import { CardData } from 'types/Nft.interface';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PurchaseAccordion } from 'components/PurchaseAccordion/PurchaseAccordion';
import { getListings } from 'services/Listings.service';
import { defaultFilterState } from 'utils/context/SearchContext';
import { Link, Spacer } from '@chakra-ui/react';
import { DescriptionBox } from 'components/PurchaseAccordion/DescriptionBox';
import { ExtraSpace } from 'components/Spacer/Spacer';

type Props = {
  tokenId: string;
  tokenAddress: string;
  onTitle: (title: string) => void;
};

export const AssetPreview = ({ tokenId, tokenAddress, onTitle }: Props): JSX.Element => {
  const [data, setData] = useState<CardData | undefined>();
  const [title, setTitle] = useState('');

  const action = 'BUY-NFT';

  useEffect(() => {
    getCardData();
  }, []);

  const getCardData = async () => {
    const filter = defaultFilterState;

    filter.tokenAddress = tokenAddress;
    filter.tokenId = tokenId;

    const result = await getListings(filter);

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

  return (
    <>
      <div className={styles.main}>
        <div className={styles.nftContent}>
          <div className={styles.left}>
            <div className={styles.imageFrame}>
              <div className={styles.imgHeader}>
                <div className={styles.imgTitle}>{title}</div>
                <Spacer />
                <div className={styles.collectionRow}>
                  <Link
                    color="brandBlue"
                    className={styles.collection}
                    href={`${window.origin}/collection/${data?.collectionName}`}
                  >
                    {data?.collectionName}
                  </Link>

                  <BlueCheckIcon large hasBlueCheck={data.hasBlueCheck === true} />
                </div>
              </div>

              <img
                alt="not available"
                src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
              />
            </div>

            <ExtraSpace />
            <DescriptionBox data={data} />
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
      </div>
    </>
  );
};
