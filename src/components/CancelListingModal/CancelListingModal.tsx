import React, { useState } from 'react';
import styles from './CancelListingModal.module.scss';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { CardData } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { apiPost } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { Button } from '@chakra-ui/react';

const isServer = typeof window === 'undefined';

interface IProps {
  data: CardData;
  onClose: () => void;
}

const CancelListingModal: React.FC<IProps> = ({ data, onClose }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, showAppError } = useAppContext();

  const cancelListing = async () => {
    setIsSubmitting(true);

    try {
      const seaport = getOpenSeaport();
      const order = await seaport.api.getOrder({
        maker: user?.account,
        id: data?.id,
        side: 1 // sell order
      });

      if (order) {
        const txnHash = await seaport.cancelOrder({
          order: order,
          accountAddress: user?.account
        });
        console.log('Cancel listing txn hash: ' + txnHash);
        const payload = {
          actionType: 'cancel',
          txnHash,
          side: 1,
          orderId: data?.id
        };
        const { error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns`, {}, payload);
        if (error) {
          showAppError((error as GenericError)?.message);
        }
      } else {
        // Handle when the order does not exist anymore
        showAppError('Listing not found to cancel. Refresh page.');
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
            <div className={styles.title}>&nbsp;</div>

            <div className={styles.row}>Cancel this listing?</div>

            <div className={styles.footer}>
              <Button
                disabled={isSubmitting}
                onClick={async () => {
                  await cancelListing();
                  onClose();
                }}
              >
                Confirm
              </Button>

              <Button colorScheme="gray" disabled={isSubmitting} ml={4} onClick={() => onClose()}>
                Close
              </Button>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default CancelListingModal;
