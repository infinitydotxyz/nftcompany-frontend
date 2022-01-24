import React, { useState } from 'react';
import styles from './CancelOfferModal.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { getOpenSeaportForChain } from 'utils/ethersUtil';
import { apiPost } from 'utils/apiUtil';
import { GenericError } from 'types';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { Button } from '@chakra-ui/react';

const isServer = typeof window === 'undefined';
interface IProps {
  data: CardData;
  onClose: () => void;
}

const CancelOfferModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const { user, showAppError, providerManager } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelOffer = async () => {
    setIsSubmitting(true);

    try {
      const seaport = getOpenSeaportForChain(data?.chainId, providerManager);
      const order = await seaport.api.getOrder({
        maker: user?.account,
        id: data.id,
        side: 0 // buy order
      });

      if (order) {
        const txnHash = await seaport.cancelOrder({
          order: order,
          accountAddress: user!.account
        });
        onClose();
        const payload = {
          actionType: 'cancel',
          txnHash,
          side: 0,
          orderId: data.id,
          maker: user?.account,
          chainId: data.chainId,
          orderData: order
        };
        const { error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns`, {}, payload);
        if (error) {
          showAppError((error as GenericError)?.message);
        }
      } else {
        // Handle when the order does not exist anymore
        showAppError('Offer not found to cancel. Refresh page.');
      }
    } catch (err) {
      showAppError((err as GenericError)?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div>
            <div className={styles.title}>Cancel Offer</div>

            <div className={styles.space}>Your offer on this NFT.</div>

            <div className={styles.row}>
              <ul>
                <li>
                  <div>Price</div>
                  <div>
                    <span>{data.metadata?.basePriceInEth}</span>
                  </div>
                  <div>WETH</div>
                </li>
              </ul>
            </div>

            <div className={styles.buttons}>
              <Button onClick={cancelOffer} disabled={isSubmitting}>
                Cancel Offer
              </Button>

              <Button disabled={isSubmitting} onClick={() => onClose && onClose()}>
                Close
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default CancelOfferModal;
