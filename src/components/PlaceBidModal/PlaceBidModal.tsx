import React, { useCallback, useEffect } from 'react';
import styles from './PlaceBidModal.module.scss';
import { Spinner } from '@chakra-ui/spinner';
import { CardData, Order } from 'types/Nft.interface';
import { getOpenSeaportForChain } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { apiPost } from 'utils/apiUtil';
import { Button, Input } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { getToken } from 'utils/commonUtil';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { LISTING_TYPE } from 'utils/constants';

const isServer = typeof window === 'undefined';

interface IProps {
  data: CardData;
  onClose: () => void;
}

const PlaceBidModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [isBuying, setIsBuying] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>();
  const [order, setOrder] = React.useState<Order | undefined>();
  const [offerPrice, setOfferPrice] = React.useState(0);
  const token = getToken(data.order?.metadata?.listingType, data.order?.metadata?.chainId);
  const listingType = data.order?.metadata?.listingType;

  const loadOrder = useCallback(async () => {
    let orderParams: any;
    if (data.id && data.maker) {
      orderParams = {
        maker: data.maker,
        id: data.id,
        side: 1, // sell order
        tokenId: data.tokenId,
        tokenAddress: data.tokenAddress
      };
    } else {
      orderParams = {
        maker: data.owner,
        tokenId: data.tokenId,
        tokenAddress: data.tokenAddress,
        side: 1 // sell order
      };
    }

    try {
      const seaport = getOpenSeaportForChain(data?.chainId);
      const order: Order = await seaport.api.getOrder(orderParams);
      setOrder(order);
    } catch (err: any) {
      console.log(err);
    }
  }, [data]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const onClickBuyNow = async () => {
    try {
      // Important to check if the order is still available as it can have already been fulfilled by
      // another user or cancelled by the creator
      if (order) {
        setIsBuying(true);
        const seaport = getOpenSeaportForChain(data?.chainId);

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
          feesInEth: +feesInEth,
          chainId: data.chainId
        };
        const { error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns`, {}, payload);
        if (error) {
          showAppError((error as GenericError)?.message);
        } else {
          onClose();
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

  const makeAnOffer = () => {
    if (offerPrice <= 0) {
      showAppError(`Offer Price must be greater than 0.`);
      return;
    }
    if (listingType === LISTING_TYPE.ENGLISH_AUCTION) {
      const basePriceInEthNum = data.metadata?.basePriceInEth ?? 0; // validate: offer price must be >= min price:
      if (offerPrice < basePriceInEthNum) {
        showAppError(`Offer Price must be greater than the minimum price: ${basePriceInEthNum} WETH.`);
        return;
      }
    }
    try {
      setIsSubmitting(true);
      const seaport = getOpenSeaportForChain(data?.chainId);
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
          onClose();
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
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div>
            {listingType !== LISTING_TYPE.ENGLISH_AUCTION && (
              <>
                <div className={styles.title}>Buy Now</div>

                <div className={styles.space}>Buy this NFT at the fixed price.</div>

                {data.metadata?.basePriceInEth && (
                  <div className={styles.priceRow}>
                    <PriceBox
                      price={data.metadata?.basePriceInEth}
                      token={token}
                      expirationTime={data?.expirationTime}
                    />
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
              </>
            )}

            <div className={styles.title}>Make an offer</div>
            <div className={styles.space}>Place a bid on this NFT.</div>

            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                makeAnOffer();
              }}
            >
              {listingType === LISTING_TYPE.ENGLISH_AUCTION && (
                <div className={styles.row}>
                  <div className={styles.left}>
                    <div>Minimum Price</div>
                  </div>
                  <div className={styles.middle}>
                    <PriceBox
                      justifyRight
                      price={data.metadata?.basePriceInEth}
                      token="WETH"
                      expirationTime={data?.expirationTime}
                    />
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
                <Button colorScheme="gray" disabled={isSubmitting} onClick={() => onClose && onClose()}>
                  Cancel
                </Button>

                {isSubmitting && <Spinner size="md" color="teal" ml={4} />}
              </div>
            </form>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default PlaceBidModal;
