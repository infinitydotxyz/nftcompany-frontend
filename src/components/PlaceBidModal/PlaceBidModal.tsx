import React, { useCallback, useEffect } from 'react';
import styles from './PlaceBidModal.module.scss';
import DatePicker from 'react-widgets/DatePicker';
import { Spinner } from '@chakra-ui/spinner';
import { CardData, Order } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { apiPost } from 'utils/apiUtil';
import { Button, Input } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import ModalDialog from 'hooks/ModalDialog';
import { getToken, stringToFloat } from 'utils/commonUtil';

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
  const [order, setOrder] = React.useState<Order | undefined>();
  const [offerPrice, setOfferPrice] = React.useState(0);
  const token = getToken(data?.data?.paymentToken);

  const loadOrder = useCallback(async () => {
    let orderParams: any;

    if (data.id && data.maker) {
      orderParams = {
        maker: data.maker,
        id: data.id,
        side: 1 // sell order
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
      const seaport = getOpenSeaport();
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
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white', width: 550 }}>
            <div className="modal-body">
              <div className={styles.title}>Purchase</div>

              {token === 'ETH' && <div className={styles.space}>Buy this NFT at the fixed price.</div>}

              {data.price && (
                <div className={styles.row}>
                  <div className={styles.left}>{token === 'WETH' ? 'Minimum Price' : 'Price'}</div>

                  <div className={styles.right}>
                    <PriceBox justifyRight price={data.price} token={token} expirationTime={data?.expirationTime} />
                  </div>
                </div>
              )}

              {token === 'ETH' && (
                <div className={styles.footer}>
                  <Button isDisabled={!order} onClick={onClickBuyNow} disabled={isBuying}>
                    Purchase
                  </Button>

                  {isBuying && <Spinner size="md" color="teal" ml={4} mt={2} />}
                </div>
              )}

              <div className={styles.space}>
                <hr />
              </div>

              <div className={styles.title}>Make an offer</div>
              <div className={styles.space}>Place a bid on this NFT.</div>

              <form
                onSubmit={(ev) => {
                  ev.preventDefault();
                  makeAnOffer();
                }}
              >
                <div className={styles.row}>
                  <div className={styles.left}>
                    <div>Enter offer</div>
                  </div>
                  <div className={styles.right}>
                    <div>
                      <Input
                        style={{ width: 166 }}
                        required
                        size={'sm'}
                        type="number"
                        step={0.000000001}
                        onChange={(ev) => setOfferPrice(parseFloat(ev.target.value))}
                      />
                    </div>
                    <div className={styles.token}>{token}</div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.left}>
                    <div>Expiry date</div>
                  </div>
                  <div className={styles.right}>
                    <DatePicker
                      includeTime
                      onChange={(dt) => setExpiryTimeSeconds(Math.round((dt || Date.now()).valueOf() / 1000))}
                      style={{ marginRight: 52 }}
                      containerClassName={styles.datePicker}
                    />
                  </div>
                  <div>&nbsp;</div>
                </div>

                <div className={styles.footer}>
                  <Button type="submit" disabled={isSubmitting}>
                    Make an Offer
                  </Button>
                  <Button colorScheme="gray" ml={4} disabled={isSubmitting} onClick={() => onClose && onClose()}>
                    Cancel
                  </Button>

                  {isSubmitting && <Spinner size="md" color="teal" ml={4} mt={2} />}
                </div>
              </form>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default PlaceBidModal;
