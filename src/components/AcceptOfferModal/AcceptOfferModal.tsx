import React from 'react';
import dynamic from 'next/dynamic';
import styles from './AcceptOfferModal.module.scss';
import { CardData } from 'types/Nft.interface';
import { getOpenSeaport } from 'utils/ethersUtil';
import { apiPost } from 'utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  data: CardData;
  onClose?: () => void;
}

const AcceptOfferModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [offerPrice, setOfferPrice] = React.useState(0);
  const { user, showAppError } = useAppContext();

  const acceptOffer = () => {
    try {
      const seaport = getOpenSeaport();
      seaport.api
        .getOrder({
          maker: data.maker,
          id: data.id,
          side: 0 // buy order
        })
        .then(async function (order: any) {
          // Important to check if the order is still available as it can have already been fulfilled by
          // another user or cancelled by the creator
          if (order) {
            const { txnHash, salePriceInEth, feesInEth } = await seaport.fulfillOrder({
              order: order,
              accountAddress: user!.account
            });
            console.log(
              'Accept offer txn hash: ' + txnHash + ' salePriceInEth: ' + salePriceInEth + ' feesInEth: ' + feesInEth
            );
            const payload = {
              actionType: 'fulfill',
              txnHash,
              side: 0,
              orderId: data.id,
              maker: data.maker,
              salePriceInEth: +salePriceInEth,
              feesInEth: +feesInEth
            };
            const { result, error } = await apiPost(`/u/${user?.account}/wyvern/v1/pendingtxns`, {}, payload);
            if (error) {
              showAppError((error as GenericError)?.message);
            }
          } else {
            // Handle when the order does not exist anymore
            showAppError('Offer no longer exists');
          }
        });
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
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white' }}>
            <div className="modal-body">
              <div className={styles.title}>Accept Offer</div>

              <div className={styles.space}>You are about to sell this NFT.</div>

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
                <a className="action-btn" onClick={acceptOffer}>
                  Accept Offer
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

export default AcceptOfferModal;
