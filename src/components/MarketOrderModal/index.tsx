import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { useAppContext } from 'utils/context/AppContext';
import { Button, FormControl, Input, FormLabel } from '@chakra-ui/react';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { BuyOrder, isBuyOrder, isSellOrder, MarketOrder, SellOrder } from '@infinityxyz/lib/types/core';

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
  const [price, setPrice] = useState<number>(1.23);
  const [expiration, setExpiration] = useState<number>(expirationTime);
  const [collectionAddress, setCollectionAddress] = useState('0xAddress1');
  const [collectionName, setCollectionName] = useState('goop bros');
  const [tokenId, setTokenId] = useState('0xasdfasdfasdfasdf');
  const [tokenName, setTokenName] = useState('Grey Dog');
  const [collectionAddresses, setCollectionAddresses] = useState(['0xAddress1', '0xAddress2']);

  useEffect(() => {
    let buyOrder: BuyOrder | undefined;
    let sellOrder: SellOrder | undefined;

    if (isBuyOrder(inOrder)) {
      buyOrder = inOrder as BuyOrder;
    } else if (isSellOrder(inOrder)) {
      sellOrder = inOrder as SellOrder;
    }

    if (buyOrder) {
      setExpiration(buyOrder.expiration);

      setMinNFTs(buyOrder.minNFTs);
      setBudget(buyOrder.budget);
      setCollectionAddresses(buyOrder.collectionAddresses);
    }

    if (sellOrder) {
      setExpiration(sellOrder.expiration);

      setPrice(sellOrder.price);
      setCollectionAddress(sellOrder.collectionAddress);
      setCollectionName(sellOrder.collectionName);
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
          expiration: expiration,
          minNFTs: minNFTs
        };

        onClose(order, undefined);
      }
    } else {
      if (user?.account && chainId && collectionAddress && collectionName && tokenId && tokenName) {
        dataOK = true;

        const order: SellOrder = {
          user: user.account,
          chainId: chainId,
          collectionAddress: collectionAddress,
          expiration: expiration,
          collectionName: collectionName,
          price: price,
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
      <Input
        fontWeight={500}
        type="text"
        placeholder="Collection Address"
        value={collectionAddress}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setCollectionAddress(e.target.value)}
      />
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

  const collectionNameField = (
    <FormControl>
      <FormLabel>Collection Name</FormLabel>
      <Input
        fontWeight={500}
        type="text"
        placeholder="Collection Name"
        value={collectionName}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setCollectionName(e.target.value)}
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

  const priceField = (
    <FormControl>
      <FormLabel>Price</FormLabel>
      <Input
        fontWeight={500}
        type="number"
        placeholder="2.33"
        value={price}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setPrice(parseFloat(e.target.value))}
      />
    </FormControl>
  );

  const expirationField = (
    <FormControl>
      <FormLabel>Expiration</FormLabel>
      <Input
        fontWeight={500}
        type="number"
        placeholder="21321323"
        value={expiration}
        onSubmit={() => {
          onSubmit();
        }}
        onChange={(e: any) => setExpiration(parseInt(e.target.value))}
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
          {expirationField}
        </>
      );
    } else {
      content = (
        <>
          {collectionAddressField}
          {tokenIdField}
          {tokenNameField}
          {collectionNameField}
          {priceField}
          {expirationField}
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
