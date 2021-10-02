import React, { useCallback, useEffect } from 'react';
import styles from './MakeOfferForm.module.scss';
import { Spinner } from '@chakra-ui/spinner';
import { CardData, Order } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { apiPost } from 'utils/apiUtil';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Input
} from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import { getToken, stringToFloat } from 'utils/commonUtil';
import { DatePicker } from 'components/DatePicker/DatePicker';

interface IProps {
  data: CardData;
  order: Order;
  onComplete: () => void;
}

export const MakeOfferForm: React.FC<IProps> = ({ onComplete, data, order }: IProps) => {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [isBuying, setIsBuying] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>();
  const [offerPrice, setOfferPrice] = React.useState(0);
  const token = getToken(order.paymentToken);

  const makeAnOffer = () => {
    if (offerPrice <= 0) {
      showAppError(`Offer Price must be greater than 0.`);
      return;
    }
    if (token === 'WETH') {
      const basePriceInEthNum = stringToFloat(data.metadata?.basePriceInEth); // validate: offer price must be >= min price:
      if (offerPrice < basePriceInEthNum) {
        showAppError(`Offer Price must be greater than Minimum Price ${basePriceInEthNum} WETH.`);
        return;
      }
    }
    try {
      setIsSubmitting(true);
      const seaport = getOpenSeaport();
      seaport
        .createBuyOrder({
          asset: {
            tokenAddress: data.tokenAddress!,
            tokenId: data.tokenId!,
            schemaName: data?.schemaName // getSchemaName(data.tokenAddress!)
          },
          accountAddress: user!.account,
          startAmount: offerPrice,
          assetDetails: data,
          expirationTime: expiryTimeSeconds
        })
        .then(() => {
          showAppMessage('Offer sent successfully.');
          setIsSubmitting(false);
          onComplete();
        })
        .catch((err: GenericError) => {
          setIsSubmitting(false);
          console.error('ERROR:', err);
          showAppError(err?.message);
        });
    } catch (err) {
      setIsSubmitting(false);
      showAppError((err as GenericError)?.message);
    }
  };

  return (
    <div>
      <div className={styles.title}>Make an offer</div>
      <div className={styles.space}>Place a bid on this NFT.</div>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          makeAnOffer();
        }}
      >
        {token === 'WETH' && (
          <div className={styles.row}>
            <div className={styles.left}>
              <div>Minimum Price</div>
            </div>
            <div className={styles.middle}>
              <PriceBox justifyRight price={data.price} token={token} expirationTime={data?.expirationTime} />
            </div>
            <div className={styles.right}>&nbsp;</div>
          </div>
        )}

        <div className={styles.row}>
          <div className={styles.left}>
            <div>Enter offer</div>
          </div>
          <div className={styles.middle}>
            <Input
              className={styles.offerBorder}
              required
              size={'sm'}
              type="number"
              step={0.000000001}
              onChange={(ev) => setOfferPrice(parseFloat(ev.target.value))}
            />
          </div>
          {/*  hardcoded to weth
                     <div className={styles.token}>{token}</div>  */}
          <div className={styles.right}>WETH</div>
        </div>
        <div className={styles.row}>
          <div className={styles.left}>
            <div>Expiry date</div>
          </div>
          <div className={styles.middle}>
            <DatePicker
              placeholder="Optional"
              value={expiryDate}
              onChange={(date) => {
                setExpiryDate(date);
                setExpiryTimeSeconds(Math.round((date || Date.now()).valueOf() / 1000));
              }}
            />
          </div>
          <div className={styles.right}></div>
        </div>

        <div style={{ height: 10 }} />

        <div className={styles.buttons}>
          <Button type="submit" disabled={isSubmitting}>
            Make an Offer
          </Button>

          {isSubmitting && <Spinner size="md" color="teal" ml={4} />}
        </div>
      </form>
    </div>
  );
};
