import React from 'react';
import dynamic from 'next/dynamic';
import styles from './OfferStatusModal.module.scss';
import { CardData } from 'components/Card/Card';
import { useAppContext } from 'utils/context/AppContext';
import { apiDelete } from 'utils/apiUtil';
import { GenericError } from 'types';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  data: CardData;
  onClose?: () => void;
}

const OfferStatusModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [offerPrice, setOfferPrice] = React.useState(0);
  const { user, showAppError } = useAppContext();

  const cancelOffer = async () => {
    try {
      await apiDelete(`/u/${user!.account}/offers/${data.id}`);
    } catch (err) {
      showAppError((err as GenericError)?.message);
    }
  };

  return (
    <>
      {!isServer && (
        <Modal
          brandColor={'blue'}
          isActive={true}
          onClose={onClose}
          activator={({ setShow }: any) => (
            <div onClick={() => setShow(true)} className={'nftholder'}>
              &nbsp;
            </div>
          )}
        >
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'blue' }}>
            <div className="modal-body">
              <div className={styles.title}>Offer Status</div>

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
        </Modal>
      )}
    </>
  );
};

export default OfferStatusModal;
