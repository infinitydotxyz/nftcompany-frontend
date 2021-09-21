import React from 'react';
import dynamic from 'next/dynamic';
import styles from './CancelOfferModal.module.scss';
import { CardData } from 'types/Nft.interface';
import { useAppContext } from 'utils/context/AppContext';
import { getOpenSeaport } from 'utils/ethersUtil';
import { apiPost } from 'utils/apiUtil';
import { GenericError } from 'types';
import ModalDialog from 'hooks/ModalDialog';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';
interface IProps {
  data: CardData;
  onClose: () => void;
}

const CancelOfferModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [offerPrice, setOfferPrice] = React.useState(0);
  const { user, showAppError } = useAppContext();

  const cancelOffer = async () => {
    try {
      const seaport = getOpenSeaport();
      const order = await seaport.api.getOrder({
        maker: user!.account,
        id: data.id,
        side: 0 // buy order
      });

      if (order) {
        const txnHash = await seaport.cancelOrder({
          order: order,
          accountAddress: user!.account
        });
        console.log('Cancel offer txn hash: ' + txnHash);
        const payload = {
          actionType: 'cancel',
          txnHash,
          side: 0,
          orderId: data.id
        };
        const { result, error } = await apiPost(`/u/${user?.account}/wyvern/v1/txns`, {}, payload);
        if (error) {
          showAppError((error as GenericError)?.message);
        }
      } else {
        // Handle when the order does not exist anymore
        showAppError('Offer not found to cancel. Refresh page.');
      }
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
              <div className={styles.title}>Cancel Offer</div>

              <div className={styles.space}>Your offer on this NFT.</div>

              <div className={styles.row}>
                <ul>
                  <li>
                    <div>Price</div>
                    <div>
                      <span>{data.price}</span>
                    </div>
                    <div>ETH</div>
                  </li>
                </ul>
              </div>

              <div className={styles.footer}>
                <a className="action-btn" onClick={cancelOffer}>
                  Cancel Offer
                </a>

                <a className="action-btn action-2nd" onClick={() => onClose && onClose()}>
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default CancelOfferModal;
