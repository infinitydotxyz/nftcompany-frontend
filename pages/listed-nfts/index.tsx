import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from 'containers/layout';
import CardList from 'components/Card/CardList';
import CancelListingModal from 'components/CancelListingModal/CancelListingModal';
import { LISTING_TYPE, NULL_ADDRESS } from 'utils/constants';
import { FetchMore, NoData, PleaseConnectWallet } from 'components/FetchMore/FetchMore';
import { useAppContext } from 'utils/context/AppContext';
import LoadingCardList from 'components/LoadingCardList/LoadingCardList';
import { CardData, WyvernSchemaName } from 'types/Nft.interface';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import styles from './ListNFTs.module.scss';
import { useUserListings } from 'hooks/useUserListings';
import { createSellOrder, fetchVerifiedBonusReward, SellOrderProps } from 'components/ListNFTModal/listNFT';
import { getPaymentTokenAddress } from 'utils/commonUtil';
import { weiToEther } from 'utils/ethersUtil';
import { NftAction } from 'types';
import { ListingSource } from 'utils/context/SearchContext';

export default function ListNFTs() {
  const { user, showAppError, showAppMessage } = useAppContext();
  const [tabIndex, setTabIndex] = useState(0);
  const [deleteModalItem, setDeleteModalItem] = useState<CardData | null>(null);

  const importOrder = async (item: CardData) => {
    const order = item.order;
    if (!order) {
      showAppError('Invalid Listing');
      return;
    }
    if (!user?.account) {
      showAppError('Please login.');
      return;
    }

    const tokenAddress = order.metadata.asset.address;
    const tokenId = order.metadata.asset.id;
    const expirationTime = Number(order.expirationTime);

    const fetchBackendChecks = async () => {
      const result = await fetchVerifiedBonusReward(tokenAddress);
      return { hasBonusReward: result?.bonusReward, hasBlueCheck: result?.verified };
    };

    const backendChecks = await fetchBackendChecks();
    const chainId = order.metadata.chainId;
    let err;
    const startAmount = Number(weiToEther(order.basePrice));
    try {
      const obj: SellOrderProps & { chainId?: string } = {
        chainId: chainId,
        asset: {
          tokenAddress,
          tokenId,
          schemaName: (order?.metadata.schema || '') as WyvernSchemaName
        },
        paymentTokenAddress: getPaymentTokenAddress('', chainId),
        accountAddress: user.account,
        startAmount: startAmount,
        endAmount: startAmount,
        expirationTime,
        assetDetails: { ...item }, // custom data to pass in details.
        ...backendChecks
      };

      switch (order.metadata.listingType) {
        case LISTING_TYPE.FIXED_PRICE:
          obj.endAmount = startAmount;
          break;

        case LISTING_TYPE.DUTCH_AUCTION:
          if (!order.extra) {
            showAppError('Failed to find ending price');
            return;
          }
          obj.endAmount = Number(weiToEther(order.extra));
          break;

        case LISTING_TYPE.ENGLISH_AUCTION:
          // ignore reserve price
          obj.endAmount = startAmount;
          obj.paymentTokenAddress = getPaymentTokenAddress(LISTING_TYPE.ENGLISH_AUCTION, chainId);
          obj.waitForHighestBid = true;
          break;

        default:
          showAppError('Failed to determine order type.');
          return;
      }

      if (order.taker && order.taker !== NULL_ADDRESS) {
        obj.buyerAddress = order.taker;
      }

      await createSellOrder(obj);
    } catch (e: any) {
      err = e;
      console.error('ERROR: ', e, '   ', expirationTime);
      showAppError(e.message);
    }
    if (!err) {
      showAppMessage('NFT listed successfully!');
    }
  };

  const Listings = (props: { source: ListingSource }) => {
    const { listings, isFetching, fetchMore, currentPage, dataLoaded } = useUserListings(props.source);
    const action = props.source === ListingSource.OpenSea ? NftAction.ImportOrder : NftAction.CancelListing;

    return (
      <>
        <div>
          <PleaseConnectWallet account={user?.account} />
          <NoData dataLoaded={dataLoaded} isFetching={isFetching} data={listings} />
          {listings?.length === 0 && isFetching && <LoadingCardList />}

          <CardList
            data={listings}
            action={action}
            onClickAction={async (item, action) => {
              if (action === NftAction.ImportOrder) {
                importOrder(item);
              } else {
                setDeleteModalItem(item);
              }
            }}
          />
        </div>

        {dataLoaded && (
          <FetchMore
            currentPage={currentPage}
            data={listings}
            onFetchMore={() => {
              fetchMore();
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Listed NFTs</title>
      </Head>
      <div>
        <div className="page-container">
          <div className="section-bar">
            <div className="tg-title">Listed NFTs</div>
          </div>

          <div className="center">
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList className={styles.tabList}>
                <Tab>Infinity</Tab>
                <Tab>OpenSea</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Listings source={ListingSource.Infinity} />
                </TabPanel>

                {tabIndex === 1 && (
                  <TabPanel>
                    <Listings source={ListingSource.OpenSea} />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>

      {deleteModalItem && <CancelListingModal data={deleteModalItem} onClose={() => setDeleteModalItem(null)} />}
    </>
  );
}

// eslint-disable-next-line react/display-name
ListNFTs.getLayout = (page: NextPage) => <Layout>{page}</Layout>;
