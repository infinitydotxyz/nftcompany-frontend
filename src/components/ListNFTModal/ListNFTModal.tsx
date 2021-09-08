import React from 'react';
import dynamic from 'next/dynamic';
import { useToast } from '@chakra-ui/react';
import { showMessage } from 'utils/commonUtil';
import { Switch } from '@chakra-ui/react';
import Datetime from 'react-datetime';
import TabBar from 'components/TabBar/TabBar';
import { getAddressBalance, getSchemaName, web3GetSeaport } from 'utils/ethersUtil';
import { getAccount } from 'utils/ethersUtil';
import { apiGet } from 'utils/apiUtil';
import { WETH_ADDRESS } from 'utils/constants';
import styles from './ListNFTModal.module.scss';

const Modal = dynamic(() => import('hooks/useModal'));
const isServer = typeof window === 'undefined';

interface IProps {
  data?: any;
  onClickMakeOffer?: (nftLink: string, price: number) => void;
  onClickBuyNow?: (nftLink: string, price: number) => void;
  onClose?: () => void;
}

const ListNFTModal: React.FC<IProps> = ({ data, onClose }: IProps) => {
  const toast = useToast();
  const [price, setPrice] = React.useState(0);
  const [balance, setBalance] = React.useState('');
  const [endPriceShowed, setEndPriceShowed] = React.useState(false);
  const [reservePrice, setReservePrice] = React.useState(0);
  const [endPrice, setEndPrice] = React.useState(0);
  const [expiryTimeMs, setExpiryTimeMs] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('SET_PRICE');
  const [backendChecks, setBackendChecks] = React.useState({});

  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    const connect = async () => {
      const account = await getAccount();
      setUser({ account });

      const getBackendChecks = async () => {
        const { result } = await apiGet(`/token/${data.tokenAddress}/verfiedBonusReward`);
        setBackendChecks({ hasBonusReward: result?.bonusReward, hasBlueCheck: result?.verified });
      };
      const getInfo = async () => {
        const bal = await getAddressBalance(account);
        setBalance(parseFloat(`${bal}`).toFixed(4));
      };
      getBackendChecks();
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
                {/* <NavBar items={[{ title: 'Set Price' }, { title: 'Highest Bid' }]} active={0} /> */}
                <TabBar
                  tabs={[
                    { id: 'SET_PRICE', label: 'Set Price' },
                    { id: 'HIGHEST_BID', label: 'Highest Bid' }
                  ]}
                  activeTab={activeTab}
                  setActiveTab={(id: string) => {
                    setActiveTab(id);
                    setEndPriceShowed(false);
                  }}
                />
              </div>

              {activeTab === 'SET_PRICE' ? (
                <div className={styles.row}>
                  <ul className={styles.fields}>
                    <li>
                      <div>{endPriceShowed ? 'Starting price' : 'Price'}</div>
                      <div>
                        <input
                          className={styles.priceInput}
                          type="number"
                          autoFocus
                          onChange={(ev) => setPrice(parseFloat(ev.target.value))}
                        />
                      </div>
                      <div>ETH</div>
                    </li>
                    {endPriceShowed && (
                      <li>
                        <div>Ending price</div>
                        <div>
                          <input
                            className={styles.priceInput}
                            type="number"
                            onChange={(ev) => setEndPrice(parseFloat(ev.target.value))}
                          />
                        </div>
                        <div>ETH</div>
                      </li>
                    )}
                    <li>
                      <div>Include ending price</div>
                      <div style={{ marginRight: 10 }}>
                        <Switch size="lg" onChange={(ev) => setEndPriceShowed(ev.target.checked)} />
                      </div>
                      <div></div>
                    </li>
                    {endPriceShowed && (
                      <li>
                        <div>Expiration time</div>
                        <div>
                          <Datetime onChange={(dt: any) => setExpiryTimeMs(dt.valueOf())} />
                        </div>
                        <div></div>
                      </li>
                    )}
                    {/* <li>
                      <div>Your balance</div>
                      <div>
                        <span>{balance}</span>
                      </div>
                      <div>ETH</div>
                    </li> */}
                  </ul>
                </div>
              ) : (
                <div className={styles.row}>
                  <ul className={styles.fields}>
                    <li>
                      <div>Minimum bid</div>
                      <div>
                        <input
                          type="number"
                          className={styles.priceInput}
                          autoFocus
                          onChange={(ev) => setPrice(parseFloat(ev.target.value))}
                        />
                      </div>
                      <div>WETH</div>
                    </li>
                    <li>
                      <div>Reserve price</div>
                      <div>
                        <input
                          type="number"
                          className={styles.priceInput}
                          onChange={(ev) => setReservePrice(parseFloat(ev.target.value))}
                        />
                      </div>
                      <div>WETH</div>
                    </li>
                    <li>
                      <div>Expiration time</div>
                      <div>
                        <Datetime onChange={(dt: any) => setExpiryTimeMs(dt.valueOf())} />
                      </div>
                      <div></div>
                    </li>
                  </ul>
                </div>
              )}

              <div className={styles.footer}>
                <a
                  className="action-btn"
                  onClick={async () => {
                    if (!price) {
                      alert('Please enter price.');
                    }
                    console.log('List NFT', data);

                    // const tokenAddress = data.data.asset_contract;
                    // const tokenId = data.data.token_id;
                    const { tokenAddress, tokenId } = data;
                    const expirationTime = endPriceShowed ? expiryTimeMs : 0;
                    let err = null;
                    try {
                      const seaport = web3GetSeaport();
                      let obj: any = {
                        asset: {
                          tokenAddress,
                          tokenId,
                          schemaName: getSchemaName(tokenAddress)
                        },
                        accountAddress: user?.account,
                        startAmount: price,
                        // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
                        endAmount: endPriceShowed ? endPrice : price,
                        expirationTime,
                        assetDetails: { ...data }, // custom data to pass in details.
                        ...backendChecks
                      };
                      if (activeTab !== 'SET_PRICE') {
                        // for English Auction (Highest Bid):
                        obj['paymentTokenAddress'] = WETH_ADDRESS;
                        obj['waitForHighestBid'] = true;
                        if (reservePrice) {
                          obj['englishAuctionReservePrice'] = reservePrice;
                        }
                        obj['expirationTime'] = expiryTimeMs;
                      }
                      const listing = await seaport.createSellOrder(obj);
                      console.log('listing', listing);
                    } catch (e: any) {
                      err = e;
                      console.error(e, '   ', expirationTime);
                      showMessage(toast, 'error', e.message);
                    }
                    if (!err) {
                      showMessage(toast, 'info', 'NFT listed successfully!');
                      onClose && onClose();
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
