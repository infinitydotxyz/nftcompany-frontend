import React from 'react';
import dynamic from 'next/dynamic';
import { Switch } from '@chakra-ui/react';
import Datetime from 'react-datetime';
import TabBar from 'components/TabBar/TabBar';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';
import HelpTooltip from 'components/HelpTooltip/HelpTooltip';
import { getAddressBalance, getSchemaName, getOpenSeaport } from 'utils/ethersUtil';
import { getAccount } from 'utils/ethersUtil';
import { apiGet } from 'utils/apiUtil';
import { WETH_ADDRESS } from 'utils/constants';
import { useAppContext } from 'utils/context/AppContext';
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
  const { showAppError, showAppMessage } = useAppContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  // const [balance, setBalance] = React.useState('');
  const [endPriceShowed, setEndPriceShowed] = React.useState(false);
  const [reservePrice, setReservePrice] = React.useState(0);
  const [endPrice, setEndPrice] = React.useState(0);
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
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
      // const getInfo = async () => {
      //   const bal = await getAddressBalance(account);
      //   setBalance(parseFloat(`${bal}`).toFixed(4));
      // };
      getBackendChecks();
      // getInfo();
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
          <div className={`modal ${'ntfmodal'}`} style={{ background: 'white', borderColor: 'white' }}>
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
                      <div>Sell at a fixed or declining price.</div>
                    </li>
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
                        <div>
                          Ending price
                          <HelpTooltip text="Adding an ending price will allow this listing to expire, or for the price to be reduced until a buyer is found." />
                        </div>
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
                      <div>
                        Include ending price
                        <HelpTooltip text="Adding an ending price will allow this listing to expire, or for the price to be reduced until a buyer is found." />
                      </div>
                      <div style={{ marginRight: 10 }}>
                        <Switch size="lg" onChange={(ev) => setEndPriceShowed(ev.target.checked)} />
                      </div>
                      <div></div>
                    </li>
                    {endPriceShowed && (
                      <li>
                        <div>
                          Expiration time
                          <HelpTooltip text="Your listing will automatically end at this time. No need to cancel it!" />
                        </div>
                        <div className={styles.dateContainer}>
                          <Datetime
                            inputProps={{ style: { width: 180 } }}
                            onChange={(dt: any) => setExpiryTimeSeconds(dt.valueOf() / 1000)}
                          />
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
                  {/* ------ English Auction (Highest Bid) ------ */}
                  <ul className={styles.fields}>
                    <li>
                      <div>Auction to the highest bidder.</div>
                    </li>
                    <li>
                      <div>
                        Minimum bid
                        <HelpTooltip text="Set your starting bid price. This starting bid price will be publicly visible. If you receive a bid above this starting value but below your reserve price, you can accept it at any time." />
                      </div>
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
                      <div>
                        Reserve price
                        <HelpTooltip text="Create a hidden limit by setting a reserve price. If you don’t receive any bids equal to or greater than your reserve, the auction will end without a sale. We require a minimum reserve price of ㆔1 or the equivalent value in your selected token." />
                      </div>
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
                      <div>
                        Expiration time
                        <HelpTooltip text="Your auction will automatically end at this time and the highest bidder will win. No need to cancel it!" />
                      </div>
                      <div className={styles.dateContainer}>
                        <Datetime
                          inputProps={{ style: { width: 180 } }}
                          onChange={(dt: any) => setExpiryTimeSeconds(dt.valueOf() / 1000)}
                        />
                      </div>
                      <div></div>
                    </li>
                  </ul>
                </div>
              )}

              <div className={styles.footer}>
                <Button
                  colorScheme="blue"
                  size="md"
                  disabled={isSubmitting}
                  onClick={async () => {
                    // if (!price) {
                    //   alert('Please enter price.');
                    // }
                    console.log('List NFT', data);

                    // const tokenAddress = data.data.asset_contract;
                    // const tokenId = data.data.token_id;
                    const { tokenAddress, tokenId, collectionName } = data;
                    const expirationTime = endPriceShowed ? expiryTimeSeconds : 0;
                    let err = null;
                    try {
                      setIsSubmitting(true);
                      const seaport = getOpenSeaport();
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
                        obj['expirationTime'] = expiryTimeSeconds;
                      }
                      const listing = await seaport.createSellOrder(obj);
                    } catch (e: any) {
                      setIsSubmitting(false);
                      err = e;
                      console.error('ERROR: ', e, '   ', expirationTime);
                      showAppError(e.message);
                    }
                    if (!err) {
                      setIsSubmitting(false);
                      showAppMessage('NFT listed successfully!');
                      onClose && onClose();
                    }
                  }}
                >
                  List NFT
                </Button>

                <Button size="md" ml={4} disabled={isSubmitting} onClick={() => onClose && onClose()}>
                  Cancel
                </Button>

                {isSubmitting && <Spinner size="md" color="teal" ml={4} mt={2} />}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ListNFTModal;
