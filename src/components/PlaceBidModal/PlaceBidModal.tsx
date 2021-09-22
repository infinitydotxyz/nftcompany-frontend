import React, { useCallback, useEffect } from 'react';
import styles from './PlaceBidModal.module.scss';
import Datetime from 'react-datetime';
import { CardData, Order } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { apiPost } from 'utils/apiUtil';
import { Button, Input } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';
import ModalDialog from 'hooks/ModalDialog';

const isServer = typeof window === 'undefined';

interface IProps {
  data: CardData;
  onClose: () => void;
}

const PlaceBidModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [order, setOrder] = React.useState<Order | undefined>();
  const [offerPrice, setOfferPrice] = React.useState(0);
  const { user, showAppError, showAppMessage } = useAppContext();

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
        const seaport = getOpenSeaport();

        // const txnHash = '0xcc128a83022cf34fbc5ec756146ee43bc63f2666443e22ade15180c6304b0d54';
        // const salePriceInEth = '1';
        // const feesInEth = '1';
        const { txnHash, salePriceInEth, feesInEth } = await seaport.fulfillOrder({
          order: order,
          accountAddress: user!.account
        });
        console.log('Buy NFT txn hash: ' + txnHash + ' salePriceInEth: ' + salePriceInEth + ' feesInEth: ' + feesInEth);
        const payload = {
          actionType: 'fulfill',
          txnHash,
          side: 1,
          orderId: order.id,
          maker: order.maker,
          salePriceInEth: +salePriceInEth,
          feesInEth: +feesInEth
        };
        const { result, error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns`, {}, payload);
        if (error) {
          showAppError((error as GenericError)?.message);
        }
      } else {
        // Handle when the order does not exist anymore
        showAppError('Listing no longer exists');
      }
    } catch (err) {
      console.error('ERROR:', err);
      showAppError((err as GenericError)?.message);
    }
  };

  const makeAnOffer = () => {
    try {
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
          onClose();
        })
        .catch((err: GenericError) => {
          console.error('ERROR:', err);
          showAppError(err?.message);
        });
    } catch (err) {
      showAppError((err as GenericError)?.message);
    }
  };

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white' }}>
            <div className="modal-body">
              <div className={styles.title}>Buy NFT</div>

              <div className={styles.space}>Buy this NFT at the fixed price.</div>

              {data.price != undefined && (
                <div className={styles.row}>
                  <div className={styles.left}>Price</div>
                  <div className={styles.right}>
                    <PriceBox price={data.price} />
                  </div>
                </div>
              )}

              <div className={styles.footer}>
                <Button isDisabled={!order} onClick={onClickBuyNow}>
                  Buy now
                </Button>
              </div>

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
                    <div>WETH</div>
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.left}>
                    <div>Expire date</div>
                  </div>
                  <div className={styles.right}>
                    <Datetime
                      inputProps={{ style: { width: 165, marginRight: 52 } }}
                      onChange={(dt: any) => setExpiryTimeSeconds(dt.valueOf() / 1000)}
                    />
                  </div>
                  <div>&nbsp;</div>
                </div>

                <div className={styles.footer}>
                  <Button type="submit" className="action-btn">
                    Make an offer
                  </Button>
                  <Button colorScheme="gray" ml={4} onClick={() => onClose && onClose()}>
                    Cancel
                  </Button>
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
