import React, { useState, useEffect } from 'react';
import { getAccount } from 'utils/ethersUtil';
import { getSchemaName, getOpenSeaport } from 'utils/ethersUtil';
import ActionModal, { ActionModalType } from 'components/ActionModal/ActionModal';
import { useAppContext } from 'utils/context/AppContext';

const parseNftUrl = (nftUrl: string) => {
  const arr = nftUrl.split('0x')[1].split('/');
  let tokenId = arr[1];
  tokenId = tokenId.split('?')[0]; // ignore after question mark: "tokenId?..."
  return { tokenAddress: '0x' + arr[0], tokenId };
};

const HeaderActionButtons = () => {
  const [actionModalType, setActionModalType] = useState('');
  const [user, setUser] = useState<any>(null);
  const { showAppError, showAppMessage } = useAppContext();

  useEffect(() => {
    const connect = async () => {
      const account = await getAccount();
      setUser({ account });
    };
    connect();
  }, []);
  return (
    <>
      <li>
        <a className="connect-wallet" onClick={() => setActionModalType(ActionModalType.MakeOffer)}>
          Make Offer
        </a>
      </li>

      <li>
        <a className="connect-wallet" onClick={() => setActionModalType(ActionModalType.BuyNow)}>
          Buy Now
        </a>
      </li>

      <li>
        <a className="connect-wallet" onClick={() => setActionModalType(ActionModalType.ListNFT)}>
          List NFT
        </a>
      </li>

      {/* <li className={route === '/explore' ? 'active-link' : ''}>
                  <Link href="/explore">
                    <a>Explore</a>
                  </Link>
                </li>
                <li className={route === '/explore/items' ? 'active-link' : ''}>
                  <Link href="/explore/items">
                    <a>My items</a>
                  </Link>
                </li>
                <li className={route === '/explore/designs' ? 'active-link' : ''}>
                  <Link href="/explore/designs">
                    <a>Designs</a>
                  </Link>
                </li> */}
      {/* <li>FAQs</li> */}

      {actionModalType && (
        <ActionModal
          user={user}
          type={actionModalType}
          onClose={() => setActionModalType('')}
          onClickListNFT={async (nftUrl: string, price: number) => {
            const { tokenAddress, tokenId } = parseNftUrl(nftUrl);
            console.log('- onClickListNFT: nftLink, price', tokenAddress, tokenId, price, getSchemaName(tokenAddress));

            let err = null;
            try {
              const seaport = getOpenSeaport();
              const listing = await seaport.createSellOrder({
                asset: {
                  tokenAddress,
                  tokenId,
                  schemaName: getSchemaName(tokenAddress)
                },
                accountAddress: user?.account,
                startAmount: price,
                // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
                endAmount: price,
                expirationTime: 0
              });
              console.log('listing', listing);
            } catch (e: any) {
              err = e;
              showAppError(e.message);
            }
            if (!err) {
              showAppMessage('NFT listed successfully!');
              setActionModalType('');
            }
          }}
          onClickMakeOffer={async (nftUrl: string, price: number) => {
            const { tokenAddress, tokenId } = parseNftUrl(nftUrl);
            console.log('- onClickMakeOffer: tokenAddress, tokenId, price', tokenAddress, tokenId, price);
            let err = null;
            try {
              const seaport = getOpenSeaport();
              const listing = await seaport.createBuyOrder({
                asset: {
                  tokenAddress,
                  tokenId,
                  schemaName: getSchemaName(tokenAddress)
                },
                assetDetails: '--',
                accountAddress: user!.account,
                startAmount: price,
                // If `endAmount` is specified, the order will decline in value to that amount until `expirationTime`. Otherwise, it's a fixed-price order:
                // endAmount: 100,
                expirationTime: 0
              });
              console.log('listing', listing);
            } catch (e: any) {
              err = e;
              showAppError(e.message);
            }
            if (!err) {
              showAppMessage('Offer sent successfully!');
              setActionModalType('');
            }
          }}
          onClickBuyNow={(nftUrl: string, price: number) => {
            const { tokenAddress, tokenId } = parseNftUrl(nftUrl);
            console.log('- onClickBuyNow: tokenAddress, tokenId, price', tokenAddress, tokenId, price);
            let err = null;
            try {
              const seaport = getOpenSeaport();
              seaport.api
                .getOrder({
                  maker: '0xC844c8e1207B9d3C54878C849A431301bA9c23E0', //todo: adi this needs to be fetched
                  assetContractAddress: tokenAddress,
                  tokenId: tokenId,
                  side: 1 // OrderSide.Sell
                })
                .then(function (order: any) {
                  console.log('order', order);
                  // Important to check if the order is still available as it can have already been fulfilled by
                  // another user or cancelled by the creator
                  if (order) {
                    // This will bring the wallet confirmation popup for the user to confirm the purchase
                    seaport.fulfillOrder({ order: order, accountAddress: user?.account });
                    // todo: adi this should listen txn confirmed event and call orderFulfilledApi
                    setActionModalType('');
                  } else {
                    // Handle when the order does not exist anymore
                    showAppError('Error when purchasing.');
                  }
                });
            } catch (e: any) {
              err = e;
              showAppError(e.message);
            }
          }}
        />
      )}
    </>
  );
};

export default HeaderActionButtons;
