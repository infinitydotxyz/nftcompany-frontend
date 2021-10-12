import React, { useEffect, useState } from 'react';
import styles from './NFTPreview.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { PurchaseAccordion } from 'components/PurchaseAccordion/PurchaseAccordion';
import { getListings } from 'services/Listings.service';
import { defaultFilterState } from 'utils/context/SearchContext';

type Props = {
  tokenId: string;
  tokenAddress: string;
  onTitle: (title: string) => void;
};

export const NFTPreview = ({ tokenId, tokenAddress, onTitle }: Props): JSX.Element => {
  const [data, setData] = useState<CardData | undefined>();
  const { user } = useAppContext();

  const action = 'BUY-NFT';

  useEffect(() => {
    getCardData();
  }, []);

  const getCardData = async () => {
    const filter = defaultFilterState;

    filter.tokenAddress = tokenAddress;
    filter.tokenId = tokenId;

    const result = await getListings(filter);
  };

  if (!data) {
    return <div>no data</div>;
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.nftContent}>
          <div className={styles.left}>
            <img
              alt="not available"
              src={data.image || 'https://westsiderc.org/wp-content/uploads/2019/08/Image-Not-Available.png'}
            />
          </div>

          <div className={styles.right}>
            <div className={styles.collectionRow}>
              <div className={styles.collection}>{data?.collectionName}</div>
              <BlueCheckIcon hasBlueCheck={data.hasBlueCheck === true} />
            </div>

            <div className={styles.title}>{data?.title}</div>

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
