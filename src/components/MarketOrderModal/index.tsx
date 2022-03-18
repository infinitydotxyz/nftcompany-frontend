import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { Button, FormControl, Input, FormLabel } from '@chakra-ui/react';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import {
  BuyOrder,
  CollectionAddress,
  isBuyOrder,
  isSellOrder,
  MarketOrder,
  SellOrder
} from '@infinityxyz/lib/types/core';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { Typeahead } from 'react-bootstrap-typeahead';
import { CollectionManager } from 'utils/marketUtils';

const isServer = typeof window === 'undefined';
const expirationTime = Math.round(Date.now() / 1000) + 1000;

interface Props {
  buyMode: boolean;
  inOrder?: MarketOrder;
  onClose: (buyOrder?: BuyOrder, sellOrder?: SellOrder) => void;
}

const MarketOrderModal: React.FC<Props> = ({ inOrder, buyMode, onClose }: Props) => {
  const { user, chainId, showAppError } = useAppContext();

  // form data
  const [budget, setBudget] = useState<number>(2);
  const [minNFTs, setMinNFTs] = useState<number>(2);
  const [startPrice, setStartPrice] = useState<number>(1.23);
  const [endPrice, setEndPrice] = useState<number>(1.23);
  const [startTime, setStartTime] = useState<number>(expirationTime);
  const [endTime, setEndTime] = useState<number>(expirationTime);
  const [collectionAddress, setCollectionAddress] = useState<CollectionAddress>();
  const [tokenId, setTokenId] = useState('0xasdfasdfasdfasdf');
  const [tokenName, setTokenName] = useState('Grey Dog');
  const [collectionAddresses, setCollectionAddresses] = useState<CollectionAddress[]>([]);

  useEffect(() => {
    let buyOrder: BuyOrder | undefined;
    let sellOrder: SellOrder | undefined;

    if (isBuyOrder(inOrder)) {
      buyOrder = inOrder as BuyOrder;
    } else if (isSellOrder(inOrder)) {
      sellOrder = inOrder as SellOrder;
    }

    if (buyOrder) {
      setEndTime(buyOrder.endTime);
      setStartTime(buyOrder.startTime);

      setMinNFTs(buyOrder.minNFTs);
      setBudget(buyOrder.budget);
      setCollectionAddresses(buyOrder.collectionAddresses);
    }

    if (sellOrder) {
      setEndTime(sellOrder.endTime);
      setStartTime(sellOrder.startTime);

      setStartPrice(sellOrder.startPrice);
      setEndPrice(sellOrder.endPrice);
      setCollectionAddress(sellOrder.collectionAddress);
      setTokenId(sellOrder.tokenId);
      setTokenName(sellOrder.tokenName);
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
      <FormLabel>Collection Address</FormLabel>
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
      <FormLabel>Collection Address</FormLabel>

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
      <FormLabel>Token Id</FormLabel>
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
      <FormLabel>Token Name</FormLabel>
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
      <FormLabel>Min NFTs</FormLabel>
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
      <FormLabel>Budget</FormLabel>
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
      <FormLabel>Start Price</FormLabel>
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
      <FormLabel>End Price</FormLabel>
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
      <FormLabel>Start Time</FormLabel>

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
      <FormLabel>End Time</FormLabel>

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
          {minNFTsField}
          {budgetField}
          {collectionAddressesField}
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
