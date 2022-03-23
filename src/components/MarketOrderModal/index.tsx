import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { Button, FormControl, Input } from '@chakra-ui/react';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import {
  BuyOrder,
  CollectionAddress,
  isBuyOrder,
  isSellOrder,
  MarketOrder,
  nowSeconds,
  SellOrder
} from '@infinityxyz/lib/types/core';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { Typeahead } from 'react-bootstrap-typeahead';
import { CollectionManager } from 'utils/marketUtils';

const isServer = typeof window === 'undefined';

interface Props {
  buyMode: boolean;
  inOrder?: MarketOrder;
  onClose: (buyOrder?: BuyOrder, sellOrder?: SellOrder) => void;
}

const MarketOrderModal: React.FC<Props> = ({ inOrder, buyMode, onClose }: Props) => {
  const { user, chainId, showAppError } = useAppContext();

  // form data
  const [budget, setBudget] = useState<number>(1);
  const [minNFTs, setMinNFTs] = useState<number>(1);
  const [startPrice, setStartPrice] = useState<number>(1);
  const [endPrice, setEndPrice] = useState<number>(1);
  const [startTime, setStartTime] = useState<number>(nowSeconds());
  const [endTime, setEndTime] = useState<number>(0);
  const [collectionAddress, setCollectionAddress] = useState<CollectionAddress>();
  const [tokenId, setTokenId] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [collectionAddresses, setCollectionAddresses] = useState<CollectionAddress[]>([]);

  useEffect(() => {
    if (inOrder) {
      let buyOrder: BuyOrder | undefined;
      let sellOrder: SellOrder | undefined;

      if (isBuyOrder(inOrder)) {
        buyOrder = inOrder as BuyOrder;
      } else if (isSellOrder(inOrder)) {
        sellOrder = inOrder as SellOrder;
      }

      if (buyOrder) {
        setStartTime(buyOrder.startTime);
        setEndTime(buyOrder.endTime);

        setMinNFTs(buyOrder.minNFTs);
        setBudget(buyOrder.budget);
        setCollectionAddresses(buyOrder.collectionAddresses);
      }

      if (sellOrder) {
        setStartTime(sellOrder.startTime);
        setEndTime(sellOrder.endTime);

        setStartPrice(sellOrder.startPrice);
        setEndPrice(sellOrder.endPrice);
        setCollectionAddress(sellOrder.collectionAddress);
        setTokenId(sellOrder.tokenId);
        setTokenName(sellOrder.tokenName);
      }
    } else {
      setStartTime(nowSeconds());
      setEndTime(nowSeconds() + 1000);

      // some defaults for testing
      // remove on release?
      if (buyMode) {
        setMinNFTs(2);
        setBudget(10);
      } else {
        setStartPrice(1);
        setEndPrice(1.5);
        setTokenId('0xTokenID12345');
        setTokenName('Bird Cheese');
      }
    }
  }, [inOrder]);

  const onSubmit = async () => {
    let dataOK = false;

    if (buyMode) {
      if (user?.account && chainId && collectionAddresses.length > 0 && minNFTs > 0) {
        dataOK = true;

        const order: BuyOrder = {
          user: user.account,
          budget: budget,
          chainId: chainId,
          collectionAddresses: collectionAddresses,
          endTime: endTime,
          startTime: startTime,
          minNFTs: minNFTs
        };

        onClose(order, undefined);
      }
    } else {
      if (user?.account && chainId && collectionAddress && tokenId && tokenName) {
        dataOK = true;

        const order: SellOrder = {
          user: user.account,
          chainId: chainId,
          collectionAddress: collectionAddress,
          startTime: startTime,
          endTime: endTime,
          startPrice: startPrice,
          endPrice: endPrice,
          tokenId: tokenId,
          tokenName: tokenName
        };

        onClose(undefined, order);
      }
    }

    if (!dataOK) {
      showAppError('Data is invalid');
    }
  };

  const collectionAddressField = (
    <FormControl>
      <div className={styles.formLabel}>Collection Address</div>
      <Typeahead
        id="basic-typeahead"
        labelKey={'name'}
        onChange={(e) => {
          if (e.length > 0) {
            setCollectionAddress(e[0]);
          } else {
            setCollectionAddress(undefined);
          }
        }}
        options={CollectionManager.collections()}
        placeholder="Collection Address"
        selected={collectionAddress ? [collectionAddress] : []}
      />
    </FormControl>
  );

  const collectionAddressesField = (
    <FormControl>
      <div className={styles.formLabel}>Collection Address</div>

      <Typeahead
        id="basic-typeahead-multiple"
        multiple
        labelKey={'name'}
        onChange={setCollectionAddresses}
        options={CollectionManager.collections()}
        placeholder="Collections"
        selected={collectionAddresses}
      />

      {/* <ChipInput
        chips={collectionAddresses}
        onChange={(value) => {
          setCollectionAddresses(value);
        }}
        onDisplayName={(e) => CollectionManager.addressToName(e)}
      /> */}
    </FormControl>
  );

  const tokenIdField = (
    <FormControl>
      <div className={styles.formLabel}>Token Id</div>
      <Input
        fontWeight={500}
        type="text"
        placeholder="0xslkdjflsdjflsd"
        value={tokenId}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setTokenId(e.target.value)}
      />
    </FormControl>
  );

  const tokenNameField = (
    <FormControl>
      <div className={styles.formLabel}>Token Name</div>
      <Input
        fontWeight={500}
        type="text"
        placeholder="Token Name"
        value={tokenName}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setTokenName(e.target.value)}
      />
    </FormControl>
  );

  const minNFTsField = (
    <FormControl>
      <div className={styles.formLabel}>Min NFTs</div>
      <Input
        fontWeight={500}
        type="number"
        placeholder="4"
        value={minNFTs}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setMinNFTs(parseInt(e.target.value))}
      />
    </FormControl>
  );

  const budgetField = (
    <FormControl>
      <div className={styles.formLabel}>Budget</div>
      <Input
        fontWeight={500}
        type="number"
        placeholder="4"
        value={budget}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setBudget(parseFloat(e.target.value))}
      />
    </FormControl>
  );

  const startPriceField = (
    <FormControl>
      <div className={styles.formLabel}>Start Price</div>
      <Input
        fontWeight={500}
        type="number"
        placeholder="2.33"
        value={startPrice}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setStartPrice(parseFloat(e.target.value))}
      />
    </FormControl>
  );

  const endPriceField = (
    <FormControl>
      <div className={styles.formLabel}>End Price</div>
      <Input
        fontWeight={500}
        type="number"
        placeholder="2.33"
        value={endPrice}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setEndPrice(parseFloat(e.target.value))}
      />
    </FormControl>
  );

  const startTimeField = (
    <FormControl>
      <div className={styles.formLabel}>Start Time</div>

      <DatePicker
        value={new Date(startTime * 1000)}
        onChange={(date) => {
          setStartTime(date.getTime() / 1000);
        }}
      />
    </FormControl>
  );

  const endTimeField = (
    <FormControl>
      <div className={styles.formLabel}>End Time</div>

      <DatePicker
        value={new Date(endTime * 1000)}
        onChange={(date) => {
          setEndTime(date.getTime() / 1000);
        }}
      />
    </FormControl>
  );

  let content = null;
  if (user?.account) {
    if (buyMode) {
      content = (
        <>
          {collectionAddressesField}
          {minNFTsField}
          {budgetField}
          {startTimeField}
          {endTimeField}
        </>
      );
    } else {
      content = (
        <>
          {collectionAddressField}
          {tokenIdField}
          {tokenNameField}
          {startPriceField}
          {endPriceField}
          {startTimeField}
          {endTimeField}
        </>
      );
    }
  }

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div>
            <div className={styles.main}>
              <div className={styles.title}>{buyMode ? 'Buy Order' : 'Sell Order'}</div>
              {content}
              <div className={styles.buttons}>
                <Button onClick={() => onSubmit()}>{buyMode ? 'Buy' : 'Sell'}</Button>
                <Button variant="outline" onClick={() => onClose(undefined, undefined)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </ModalDialog>
      )}
    </>
  );
};

export default MarketOrderModal;
