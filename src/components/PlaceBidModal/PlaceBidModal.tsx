import React from 'react';
import dynamic from 'next/dynamic';
import styles from './PlaceBidModal.module.scss';
import Datetime from 'react-datetime';
import { CardData } from 'types/Nft.interface';
import { getSchemaName, getOpenSeaport } from 'utils/ethersUtil';
import { useAppContext } from 'utils/context/AppContext';
import { GenericError } from 'types';
import { apiPost } from 'utils/apiUtil';
import { Input } from '@chakra-ui/react';
import { PriceBox } from 'components/PriceBox/PriceBox';

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
      seaport.api
        .getOrder({
          maker: data.maker,
          id: data.id,
          side: 1 // sell order
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
              'Buy NFT txn hash: ' + txnHash + ' salePriceInEth: ' + salePriceInEth + ' feesInEth: ' + feesInEth
            );
            const payload = {
              actionType: 'fulfill',
              txnHash,
              side: 1,
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
            showAppError('Listing no longer exists');
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
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white' }}>
            <div className="modal-body">
              <div className={styles.title}>Buy NFT</div>

              <div className={styles.space}>You are about to buy this NFT.</div>

              {data.price != undefined && (
                <div className={styles.row}>
                  <div className={styles.left}>Price</div>
                  <div className={styles.right}>
                    <PriceBox price={data.price} />
                  </div>
                </div>
              )}

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
                <div className={styles.left}>
                  <div>Enter offer</div>
                </div>
                <div className={styles.right}>
                  <div>
                    <Input
                      style={{ width: 166 }}
                      size={'sm'}
                      type="number"
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
                  <Datetime onChange={(dt: any) => setExpiryTimeSeconds(dt.valueOf() / 1000)} />
                </div>
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
