import React from 'react';
import { Switch } from '@chakra-ui/react';
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
import { DatePicker } from 'components/DatePicker/DatePicker';

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
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>();

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
          <div>
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
                <div className={styles.fields}>Sell at a fixed or declining price.</div>
                <div className={styles.fields}>
                  <div className={styles.left}>{endPriceShowed ? 'Starting price' : 'Price'}</div>
                  <div className={styles.middle}>
                    <input
                      className={styles.priceInput}
                      type="number"
                      autoFocus
                      onChange={(ev) => setPrice(parseFloat(ev.target.value))}
                    />
                  </div>
                  <div className={styles.right}>ETH</div>
                </div>
                {endPriceShowed && (
                  <div className={styles.fields}>
                    <div className={styles.left}>
                      <div>Ending price</div>
                      <HelpTooltip text="Adding an ending price will allow this listing to expire, or for the price to be reduced until a buyer is found." />
                    </div>
                    <div className={styles.middle}>
                      <input
                        className={styles.priceInput}
                        type="number"
                        onChange={(ev) => setEndPrice(parseFloat(ev.target.value))}
                      />
                    </div>
                    <div className={styles.right}>ETH</div>
                  </div>
                )}

                <div className={styles.fields}>
                  <div className={styles.left}>
                    <div>Include ending price</div>
                    <HelpTooltip text="Adding an ending price will allow this listing to expire, or for the price to be reduced until a buyer is found." />
                  </div>
                  <div className={styles.middle}>
                    <Switch size="lg" onChange={(ev) => setEndPriceShowed(ev.target.checked)} />
                  </div>
                  <div className={styles.right}></div>
                </div>

                {endPriceShowed && (
                  <div className={styles.fields}>
                    <div className={styles.left}>
                      <div>Expiration time</div>
                      <HelpTooltip text="Your listing will automatically end at this time. No need to cancel it!" />
                    </div>
                    <div className={styles.middle}>
                      <DatePicker
                        value={expiryDate}
                        onChange={(date) => {
                          setExpiryDate(date);
                          setExpiryTimeSeconds(Math.round((date || Date.now()).valueOf() / 1000));
                        }}
                      />
                    </div>
                    <div className={styles.right}></div>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.row}>
                {/* ------ English Auction (Highest Bid) ------ */}
                <div className={styles.fields}>Auction to the highest bidder.</div>
                <div className={styles.fields}>
                  <div className={styles.left}>
                    <div>Minimum bid</div>
                    <HelpTooltip text="Set your starting bid price. This starting bid price will be publicly visible. If you receive a bid above this starting value but below your reserve price, you can accept it at any time." />
                  </div>
                  <div className={styles.middle}>
                    <input
                      type="number"
                      className={styles.priceInput}
                      autoFocus
                      onChange={(ev) => setPrice(parseFloat(ev.target.value))}
                    />
                  </div>
                  <div className={styles.right}>WETH</div>
                </div>
                <div className={styles.fields}>
                  <div className={styles.left}>
                    <div>Reserve price</div>
                    <HelpTooltip text="Create a hidden limit by setting a reserve price. If you don’t receive any bids equal to or greater than your reserve, the auction will end without a sale. We require a minimum reserve price of ㆔1 or the equivalent value in your selected token." />
                  </div>
                  <div className={styles.middle}>
                    <input
                      type="number"
                      className={styles.priceInput}
                      onChange={(ev) => setReservePrice(parseFloat(ev.target.value))}
                    />
                  </div>
                  <div className={styles.right}>WETH</div>
                </div>
                <div className={styles.fields}>
                  <div className={styles.left}>
                    <div>Expiration time</div>
                    <HelpTooltip text="Your auction will automatically end at this time and the highest bidder will win. No need to cancel it!" />
                  </div>
                  <div className={styles.middle}>
                    <DatePicker
                      value={expiryDate}
                      onChange={(date) => {
                        setExpiryDate(date);
                        setExpiryTimeSeconds(Math.round((date || Date.now()).valueOf() / 1000));
                      }}
                    />
                  </div>
                  <div className={styles.right}></div>
                </div>
              </div>
            )}

            <div className={styles.buttons}>
              <Button disabled={isSubmitting} onClick={onClickListNft}>
                List NFT
              </Button>

              <Button colorScheme="gray" disabled={isSubmitting} onClick={() => onClose && onClose()}>
                Cancel
              </Button>

              {isSubmitting && <Spinner size="md" color="teal" ml={4} />}
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default ListNFTModal;
