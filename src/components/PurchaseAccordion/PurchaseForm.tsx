import React, { useState } from 'react';
import styles from './PurchaseForm.module.scss';
import { Spinner } from '@chakra-ui/spinner';
import { CardData, Order } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { apiPost } from 'utils/apiUtil';
import { Button } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { getToken } from 'utils/commonUtil';

interface IProps {
  data: CardData;
  order: Order;
  onComplete: () => void;
}

export const PurchaseForm: React.FC<IProps> = ({ onComplete, data, order }: IProps) => {
  const { user, showAppError } = useAppContext();
  const [isBuying, setIsBuying] = useState(false);
  const token = getToken(order.paymentToken);

  const onClickBuyNow = async () => {
    try {
      // Important to check if the order is still available as it can have already been fulfilled by
      // another user or cancelled by the creator
      if (order) {
        setIsBuying(true);
        const seaport = getOpenSeaport();

        // const txnHash = '0xcc128a83022cf34fbc5ec756146ee43bc63f2666443e22ade15180c6304b0d54';
        // const salePriceInEth = '1';
        // const feesInEth = '1';
        const { txnHash, salePriceInEth, feesInEth } = await seaport.fulfillOrder({
          order: order,
          accountAddress: user!.account
        });
        // console.log('Buy NFT txn hash: ' + txnHash + ' salePriceInEth: ' + salePriceInEth + ' feesInEth: ' + feesInEth);
        const payload = {
          actionType: 'fulfill',
          txnHash,
          side: 1,
          orderId: order.id,
          maker: order.maker,
          salePriceInEth: +salePriceInEth,
          feesInEth: +feesInEth
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

  if (token === 'ETH') {
    return (
      <div>
        <div className={styles.title}>Buy Now</div>

        <div className={styles.space}>Buy this NFT at the fixed price.</div>

        {data.price && (
          <div className={styles.priceRow}>
            <PriceBox price={data.price} token={token} expirationTime={data?.expirationTime} />
          </div>
        )}

        <div className={styles.buttons}>
          <Button isDisabled={!order} onClick={onClickBuyNow} disabled={isBuying}>
            Buy Now
          </Button>

          {isBuying && <Spinner size="md" color="teal" ml={4} />}
        </div>

        <div className={styles.lineSpace}>
          <hr />
        </div>
      </div>
    );
  }

  return <div>{"Items in {token} can't be purchased. Make an offer instead."}</div>;
};
