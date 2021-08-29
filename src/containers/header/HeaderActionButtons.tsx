import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { FilterContext } from 'hooks/useFilter';
import { useRouter } from 'next/router';
import { getAccount, getProvider } from 'utils/ethersUtil';
import CopyInstructionModal from 'components/CopyInstructionModal/CopyInstructionModal';

// import { OpenSeaPort, Network } from '../../../src-os/src';
// import Web3 from 'web3';
const Web3 = require('web3');
const OpenSeaPort = require('../../../src-os/src').OpenSeaPort;
const Network = require('../../../src-os/src').Network;
const Sell = require('../../../src-os/src').Sell;

const HeaderActionButtons = ({ user }: { user: any }) => {
  const router = useRouter();
  const { route } = router;
  const [copyModalShowed, setCopyModalShowed] = useState(false);

  useEffect(() => {}, []);
  return (
    <>
      <ul className="links">
        <li>
          <a className="connect-wallet" onClick={() => setCopyModalShowed(true)}>
            Make Offer
          </a>
        </li>

        <li>
          <a className="connect-wallet" onClick={() => setCopyModalShowed(true)}>
            Buy Now
          </a>
        </li>

        <li>
          <a className="connect-wallet" onClick={() => setCopyModalShowed(true)}>
            List NFT
          </a>
        </li>

        <li className={route === '/explore/nfts' ? 'active-link' : ''}>
          <Link href="/explore/nfts">
            <a>Explore NFTs</a>
          </Link>
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

        {user?.account ? (
          <li
            onClick={() => {
              let web3 = new Web3();
              if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                // try {
                //   window.ethereum.enable().then(() => {
                //     // User has allowed account access to DApp...
                //   })
                // } catch (e) {
                //   // User has denied account access to DApp...
                // }
              } else if ((window as any).web3) {
                web3 = new Web3(web3.currentProvider);
              } else {
                alert('You have to install MetaMask !');
              }
              const provider = web3.currentProvider;
              // const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io');
              const seaport = new OpenSeaPort(provider, {
                networkName: Network.Main
              });
              // asset_contract_address: '0x495f947276749ce646f68ac8c248420045cb7b5e',
              // token_id: '93541831110195558149617722636526811076207680274132077301105327944255259279361',
              // asset_contract_address: '0x4a453df93535f6baa8dc3cb1b0c032289da3bd16',
              //     token_id: '9824',
              // 0x719e22985111302110942ad3503e3fa104922a7b/823   0.001   purchased
              // 0x719e22985111302110942ad3503e3fa104922a7b/825   0.001   done
              seaport.api
                .getOrder({
                  asset_contract_address: '0x719e22985111302110942ad3503e3fa104922a7b',
                  token_id: '826',
                  side: Sell
                })
                .then(function (order: any) {
                  console.log('order', order);
                  // Important to check if the order is still available as it can have already been fulfilled by
                  // another user or cancelled by the creator
                  if (order) {
                    // This will bring the wallet confirmation popup for the user to confirm the purchase
                    seaport.fulfillOrder({ order: order, accountAddress: user?.account });
                  } else {
                    // Handle when the order does not exist anymore
                  }
                });
            }}
          >
            <a className="connect-wallet">{`${user?.account.slice(0, 6)}...${user?.account.slice(-4)}`}</a>
          </li>
        ) : (
          <li>
            <Link href="/connect">
              <a className="connect-wallet">
                <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.19.367a14.05 14.05 0 00-6.38 0l-.44.102C3.435 1.153 1.121 3.524.397 6.59c-.53 2.24-.53 4.58 0 6.82.724 3.066 3.038 5.437 5.973 6.12l.44.103c2.101.49 4.279.49 6.38 0l.44-.102c2.935-.684 5.249-3.055 5.973-6.121.53-2.24.53-4.58 0-6.82-.724-3.066-3.038-5.437-5.973-6.12l-.44-.103zm3.066 7.197a5.322 5.322 0 011.197-.077c.438.022.783.382.842.84.143 1.11.143 2.236 0 3.347-.059.457-.404.817-.842.838-.398.02-.8-.005-1.197-.076l-.078-.014c-1.033-.185-1.832-.921-2.102-1.849a2.047 2.047 0 010-1.146c.27-.928 1.069-1.664 2.102-1.849l.078-.014zM5.101 6.641c0-.37.286-.671.639-.671H10c.353 0 .64.3.64.671 0 .371-.287.672-.64.672H5.74c-.353 0-.64-.3-.64-.672z"
                    fill="#fff"
                  />
                </svg>
                Connect
              </a>
            </Link>
          </li>
        )}
      </ul>

      {copyModalShowed && <CopyInstructionModal onClose={() => setCopyModalShowed(false)} />}
    </>
  );
};

export default HeaderActionButtons;
