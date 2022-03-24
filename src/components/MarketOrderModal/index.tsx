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
import { OBOrder, Item, ExecParams, ExtraParams } from 'utils/exchange/orders';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { Typeahead } from 'react-bootstrap-typeahead';
import { CollectionManager } from 'utils/marketUtils';
import { BigNumberish } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';

const isServer = typeof window === 'undefined';

interface Props {
  inOrder?: OBOrder;
  onClose: (order?: OBOrder) => void;
}

const ORDER_NONCE = 1;

const MarketOrderModal: React.FC<Props> = ({ inOrder, onClose }: Props) => {
  const { user, chainId, showAppError } = useAppContext();

  // form data
  const [isSellOrder, setIsSellOrder] = useState<boolean>(false);
  const [numItems, setNumItems] = useState<BigNumberish>(1);
  const [startPrice, setStartPrice] = useState<BigNumberish>(1);
  const [endPrice, setEndPrice] = useState<BigNumberish>(1);
  const [startTime, setStartTime] = useState<BigNumberish>(nowSeconds());
  const [endTime, setEndTime] = useState<BigNumberish>(nowSeconds() + 1000);
  const [collections, setCollections] = useState<CollectionAddress[]>([CollectionManager.collections()[0]]);
  const [tokenId, setTokenId] = useState<string>('1');
  const [complicationAddress, setComplicationAddress] = useState<string>('');
  const [currencyAddress, setCurrencyAddress] = useState<string>('');
  const [buyer, setBuyer] = useState<string>('');

  useEffect(() => {
    if (inOrder) {
      setIsSellOrder(inOrder.isSellOrder);
      setNumItems(inOrder.numItems);
      setStartTime(inOrder.startTime);
      setEndTime(inOrder.endTime);
      setStartPrice(inOrder.startPrice);
      setEndPrice(inOrder.endTime);
    }
  }, [inOrder]);

  const onSubmit = async () => {
    let dataOK = false;
    if (user?.account && chainId) {
      dataOK = true;

      const orderId = solidityKeccak256(['address', 'uint256', 'uint256'], [user.account, ORDER_NONCE, chainId]);

      const order: OBOrder = {
        id: orderId,
        chainId: chainId,
        isSellOrder: isSellOrder,
        signerAddress: user.account,
        numItems,
        startTime: startTime,
        endTime: endTime,
        startPrice: startPrice,
        endPrice: endPrice,
        minBpsToSeller: 9000,
        nonce: ORDER_NONCE,
        nfts: getItems(),
        execParams: getExecParams(),
        extraParams: getExtraParams()
      };

      onClose(order);
    }

    if (!dataOK) {
      showAppError('Data is invalid');
    }
  };

  const getItems = (): Item[] => {
    const items: Item[] = [];
    for (let i = 0; i < numItems; i++) {
      items.push({
        tokenIds: [tokenId],
        collection: collections[i].address
      });
    }
    return items;
  };

  const getExecParams = (): ExecParams => {
    return { complicationAddress, currencyAddress };
  };

  const getExtraParams = (): ExtraParams => {
    return { buyer };
  };

  const collectionAddressesField = (
    <FormControl>
      <div className={styles.formLabel}>Collection Address</div>

      <Typeahead
        id="basic-typeahead-multiple"
        multiple
        labelKey={'name'}
        onChange={setCollections}
        options={CollectionManager.collections()}
        placeholder="Items"
        selected={collections}
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
      <div className={styles.formLabel}>Token Ids</div>
      <Input
        fontWeight={500}
        type="text"
        placeholder="1234"
        value={tokenId}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setTokenId(e.target.value)}
      />
    </FormControl>
  );

  const numItemsField = (
    <FormControl>
      <div className={styles.formLabel}>Min NFTs</div>
      <Input
        fontWeight={500}
        type="number"
        placeholder="4"
        value={numItems.toString()}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setNumItems(parseInt(e.target.value))}
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
        value={startPrice.toString()}
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
        value={endPrice.toString()}
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
        value={new Date(parseInt(startTime.toString()) * 1000)}
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
        value={new Date(parseInt(endTime.toString()) * 1000)}
        onChange={(date) => {
          setEndTime(date.getTime() / 1000);
        }}
      />
    </FormControl>
  );

  let content = null;
  if (user?.account) {
    content = (
      <>
        {collectionAddressesField}
        {tokenIdField}
        {numItemsField}
        {startPriceField}
        {endPriceField}
        {startTimeField}
        {endTimeField}
      </>
    );
  }

  return (
    <>
      {!isServer && (
        <ModalDialog onClose={onClose}>
          <div>
            <div className={styles.main}>
              <div className={styles.title}>{!isSellOrder ? 'Buy Order' : 'Sell Order'}</div>
              {content}
              <div className={styles.buttons}>
                <Button onClick={() => onSubmit()}>{!isSellOrder ? 'Buy' : 'Sell'}</Button>
                <Button variant="outline" onClick={() => onClose(undefined)}>
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
