import React, { useState } from 'react';
import { CardData, Order } from 'infinity-types/types/NftInterface';
import { getOpenSeaportForChain } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { apiPost } from 'utils/apiUtil';
import { Button, Spacer, Box } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { getToken } from 'utils/commonUtil';
import { Label, Title } from 'components/Text/Text';
import { LISTING_TYPE } from 'utils/constants';
import styles from './scss/PurchaseForm.module.scss';

interface IProps {
  data: CardData;
  order: Order;
  onComplete: () => void;
}

export const PurchaseForm: React.FC<IProps> = ({ onComplete, data, order }: IProps) => {
  const { user, showAppError, providerManager } = useAppContext();
  const [isBuying, setIsBuying] = useState(false);
  const token = getToken(data.order?.metadata?.listingType, data.order?.metadata?.chainId);
  const listingType = order.metadata?.listingType;

  const onClickBuyNow = async () => {
    try {
      // Important to check if the order is still available as it can have already been fulfilled by
      // another user or cancelled by the creator
      if (order) {
        setIsBuying(true);
        const seaport = getOpenSeaportForChain(data?.chainId, providerManager);

        const { txnHash, salePriceInEth, feesInEth } = await seaport.fulfillOrder({
          order: order,
          accountAddress: user!.account
        });
        const payload = {
          actionType: 'fulfill',
          txnHash,
          side: 1,
          orderId: order.id,
          maker: order.maker,
          salePriceInEth: +salePriceInEth,
          feesInEth: +feesInEth,
          chainId: data.chainId,
          orderData: order
        };
        const { error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns`, {}, payload);
        if (error) {
          showAppError((error as GenericError)?.message);
        } else {
          onComplete();
        }
      } else {
        // Handle when the order does not exist anymore
        showAppError('Listing no longer exists');
      }
      setIsBuying(false);
    } catch (err) {
      console.error('ERROR:', err);
      showAppError((err as GenericError)?.message);
      setIsBuying(false);
    }
  };

  if (listingType !== LISTING_TYPE.ENGLISH_AUCTION) {
    return (
      <Box mt={2}>
        <Title text="Buy this NFT for the price shown" />

        {data.metadata?.basePriceInEth && (
          <div className={styles.priceRow}>
            <Label text="Price" />
            <Spacer />

            <PriceBox
              justifyRight
              price={data.metadata?.basePriceInEth}
              token={token}
              expirationTime={data?.expirationTime}
            />
          </div>
        )}

        <div className={styles.wideButton}>
          <Button
            style={{ minWidth: 160 }}
            isDisabled={!order}
            onClick={onClickBuyNow}
            loadingText="Buying"
            isLoading={isBuying}
            spinnerPlacement="end"
          >
            Buy Now
          </Button>
        </div>
      </Box>
    );
  }

  return <div>{`Items listed as English Auctions can't be purchased. Make an offer instead.`}</div>;
};
