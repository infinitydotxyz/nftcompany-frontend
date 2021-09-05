import React from 'react';
import dynamic from 'next/dynamic';
import { Switch } from '@chakra-ui/react';
import Datetime from 'react-datetime';
import NavBar from 'components/NavBar/NavBar';
import styles from './ListNFTModal.module.scss';
import { getAddressBalance, getSchemaName, web3GetSeaport } from 'utils/ethersUtil';
import { getAccount } from 'utils/ethersUtil';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  data?: any;
  onClickMakeOffer?: (nftLink: string, price: number) => void;
  onClickBuyNow?: (nftLink: string, price: number) => void;
  onClickListNFT?: (nftLink: string, price: number) => void;
  onClose?: () => void;
}

const ListNFTModal: React.FC<IProps> = ({ data, onClickListNFT, onClose }: IProps) => {
  const [price, setPrice] = React.useState(0);
  const [balance, setBalance] = React.useState('');
  const [endPriceShowed, setEndPriceShowed] = React.useState(false);
  const [endPrice, setEndPrice] = React.useState(0);
  const [expiryTimeMs, setExpiryTimeMs] = React.useState(0);

  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    const connect = async () => {
      const account = await getAccount();
      setUser({ account });

      const getInfo = async () => {
        const bal = await getAddressBalance(account);
        setBalance(parseFloat(`${bal}`).toFixed(4));
      };
      getInfo();
    };
    connect();
  }, []);
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
              <div className={styles.title}>List NFT</div>

              <div className={styles.row}>
                <NavBar items={[{ title: 'Set Price' }, { title: 'Highest Bid' }]} active={0} />
              </div>
              
              <div className={styles.row}>
                <ul className={styles.fields}>
                  <li>
                    <div>{endPriceShowed ? 'Starting price' : 'Price'}</div>
                    <div>
                      <input type="number" autoFocus onChange={(ev) => setPrice(parseFloat(ev.target.value))} />
                    </div>
                    <div>ETH</div>
                  </li>
                  {endPriceShowed && (
                    <li>
                      <div>Ending price</div>
                      <div>
                        <input type="number" onChange={(ev) => setEndPrice(parseFloat(ev.target.value))} />
                      </div>
                      <div>ETH</div>
                    </li>
                  )}
                  <li>
                    <div>Include ending price</div>
                    <div>&nbsp;</div>
                    <div>
                      <Switch size="lg" onChange={(ev) => setEndPriceShowed(ev.target.checked)} />
                    </div>
                  </li>
                  {endPriceShowed && (
                    <li>
                      <div>Expiration time</div>
                      <div>&nbsp;</div>
                      <div><Datetime onChange={(dt: any) => setExpiryTimeMs(dt.valueOf())} /></div>
                    </li>
                  )}
                  <li>
                    <div>Your balance</div>
                    <div>
                      <span>{balance}</span>
                    </div>
                    <div>ETH</div>
                  </li>
                </ul>
              </div>

              <div className={styles.footer}>
                <a
                  className="action-btn"
                  onClick={async () => {
                    if (!price) {
                      alert('Please enter price.');
                    }
                    console.log('List NFT', data);

                    const tokenAddress = data.data.asset_contract;
                    const tokenId = data.data.token_id;
                    let err = null;
                    try {
                      const seaport = web3GetSeaport();
                      const listing = await seaport.createSellOrder({
                        asset: {
                          tokenAddress,
                          tokenId,
                          schemaName: getSchemaName(tokenAddress)
                        },
                        accountAddress: user?.account,
                        startAmount: price,
                        // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
                        endAmount: endPriceShowed ? endPrice : price,
                        expirationTime: endPriceShowed ? (expiryTimeMs - +new Date()) / 1000 : 0,
                        assetDetails: { ...data } // custom data to pass in details.
                      });
                      console.log('listing', listing);
                    } catch (e) {
                      err = e;
                      // showMessage('error', e.message);
                    }
                    if (!err) {
                      // showMessage('info', 'NFT listed successfully!');
                      // setActionModalType('');
                    }
                  }}
                >
                  &nbsp;&nbsp;&nbsp; List NFT &nbsp;&nbsp;&nbsp;
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

export default ListNFTModal;