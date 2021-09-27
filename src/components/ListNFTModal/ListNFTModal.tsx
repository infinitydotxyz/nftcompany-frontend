import React from 'react';
import { Switch } from '@chakra-ui/react';
import DatePicker from 'react-widgets/DatePicker';
import TabBar from 'components/TabBar/TabBar';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';
import HelpTooltip from 'components/HelpTooltip/HelpTooltip';
import { getOpenSeaport } from 'utils/ethersUtil';
import { apiGet } from 'utils/apiUtil';
import { WETH_ADDRESS } from 'utils/constants';
import { useAppContext } from 'utils/context/AppContext';
import styles from './ListNFTModal.module.scss';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { isServer } from 'utils/commonUtil';

interface IProps {
  data?: any;
  onClickMakeOffer?: (nftLink: string, price: number) => void;
  onClickBuyNow?: (nftLink: string, price: number) => void;
  onClose: () => void;
}

const ListNFTModal: React.FC<IProps> = ({ data, onClose }: IProps) => {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [price, setPrice] = React.useState(0);
  const [endPriceShowed, setEndPriceShowed] = React.useState(false);
  const [reservePrice, setReservePrice] = React.useState(0);
  const [endPrice, setEndPrice] = React.useState(0);
  const [expiryTimeSeconds, setExpiryTimeSeconds] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('SET_PRICE');
  const [backendChecks, setBackendChecks] = React.useState({});

  React.useEffect(() => {
    const fetchBackendChecks = async () => {
      const { result } = await apiGet(`/token/${data.tokenAddress}/verfiedBonusReward`);
      setBackendChecks({ hasBonusReward: result?.bonusReward, hasBlueCheck: result?.verified });
    };
    fetchBackendChecks();
  }, []);

  const onClickListNft = async () => {
    if (!price) {
      showAppError('Please enter price.');
      return;
    }
    const { tokenAddress, tokenId } = data;
    const expirationTime = endPriceShowed ? expiryTimeSeconds : 0;
    let err = null;
    try {
      setIsSubmitting(true);
      const seaport = getOpenSeaport();
      const obj: any = {
        asset: {
          tokenAddress,
          tokenId,
          schemaName: data?.schemaName || ''
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
      await seaport.createSellOrder(obj);
    } catch (e: any) {
      setIsSubmitting(false);
      err = e;
      console.error('ERROR: ', e, '   ', expirationTime);
      showAppError(e.message);
    }
    if (!err) {
      setIsSubmitting(false);
      showAppMessage('NFT listed successfully!');
      onClose();
    }
  };

  return (
    <>
      {!isServer() && (
        <ModalDialog onClose={onClose}>
          <div style={{ width: 550 }}>
            <div className={styles.title}>List NFT</div>

            <div className={styles.row}>
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
                        <DatePicker
                          includeTime
                          onChange={(dt) => setExpiryTimeSeconds(Math.round((dt || Date.now()).valueOf() / 1000))}
                          containerClassName={styles.datePicker}
                          style={{ marginRight: 10 }}
                        />
                      </div>
                      <div></div>
                    </li>
                  )}
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
                      <DatePicker
                        includeTime
                        onChange={(dt) => setExpiryTimeSeconds(Math.round((dt || Date.now()).valueOf() / 1000))}
                        containerClassName={styles.datePicker}
                        style={{ marginRight: 10 }}
                      />
                    </div>
                    <div></div>
                  </li>
                </ul>
              </div>
            )}

            <div className={styles.footer}>
              <Button size="md" disabled={isSubmitting} onClick={onClickListNft}>
                List NFT
              </Button>

              <Button colorScheme="gray" size="md" ml={4} disabled={isSubmitting} onClick={() => onClose && onClose()}>
                Cancel
              </Button>

              {isSubmitting && <Spinner size="md" color="teal" ml={4} mt={2} />}
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default ListNFTModal;
