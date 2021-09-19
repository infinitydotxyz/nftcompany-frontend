import React from 'react';
import dynamic from 'next/dynamic';
import styles from './PlaceBidModal.module.scss';
import Datetime from 'react-datetime';
import { CardData } from 'types/Nft.interface';
import { getSchemaName, getOpenSeaport } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { apiPost } from 'utils/apiUtil';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  data: CardData;
  onClose?: () => void;
}

const PlaceBidModal: React.FC<IProps> = ({ onClose, data }: IProps) => {
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [offerPrice, setOfferPrice] = React.useState(0);
  const { user, showAppError } = useAppContext();

  const buyNft = () => {
    try {
      const seaport = getOpenSeaport();
      // todo: adi - do we need this
      seaport.api
        .getOrder({
          maker: data.maker,
          assetContractAddress: data.tokenAddress,
          tokenId: data.tokenId,
          side: 1 // OrderSide.Sell
        })
        .then(async function (order: any) {
          // Important to check if the order is still available as it can have already been fulfilled by
          // another user or cancelled by the creator
          if (order) {
            const txid = await seaport.fulfillOrder({ order: order, accountAddress: user!.account });

            console.log('buyNft result: seaport.fulfillOrder txid:', txid);
            // console.log('order', order)
            // const { result, error } = await apiPost(`/u/${user?.account}/wyvern/v1/orders/trackTxn?orderId=${order.id}`, {}, order);
            // console.log('***', result, error)
          } else {
            // Handle when the order does not exist anymore
            showAppError('Error when purchasing.');
          }
        })
        .catch((err: GenericError) => {
          console.error('ERROR:', err);
          showAppError(err?.message);
        });
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
            schemaName: getSchemaName(data.tokenAddress!)
          },
          accountAddress: user!.account,
          startAmount: offerPrice,
          assetDetails: data,
          expirationTime: expiryTimeSeconds
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
              <div className={styles.title}>Buy NFT</div>

              <div className={styles.space}>You are about to buy this NFT.</div>

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
                <a className="action-btn" onClick={buyNft}>
                  Buy now
                </a>
              </div>

              <div className={styles.space}>
                <hr />
              </div>

              <div className={styles.title}>Make an offer</div>
              <div className={styles.space}>You are about to place a bid on this NFT.</div>

              <div className={styles.row}>
                <ul>
                  <li>
                    <div>Enter bid</div>
                    <div>
                      <input type="number" onChange={(ev) => setOfferPrice(parseFloat(ev.target.value))} />
                    </div>
                    <div>ETH</div>
                  </li>
                  <li>
                    <div>Your balance</div>
                    <div>
                      <span>5.2</span>
                    </div>
                    <div>ETH</div>
                  </li>
                  <li>
                    <div>Expire date</div>
                    <div>
                      <Datetime onChange={(dt: any) => setExpiryTimeSeconds(dt.valueOf() / 1000)} />
                    </div>
                  </li>
                </ul>
              </div>

              <div className={styles.footer}>
                <a className="action-btn" onClick={makeAnOffer}>
                  Make an offer
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

export default PlaceBidModal;
