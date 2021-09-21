import React, { useEffect, useState } from 'react';
import { MenuItem, MenuDivider, Box } from '@chakra-ui/react';
import { ExternalLinkIcon, SettingsIcon, StarIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAccount } from '../../../src/utils/ethersUtil';
import { setAuthHeaders } from '../../../src/utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';
import ExploreSearch from 'components/ExploreSearch/ExploreSearch';
import { AddressMenuItem } from 'components/AddressMenuItem/AddressMenuItem';
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';
import SettingsModal from 'components/SettingsModal/SettingsModal';
import MoreVert from './more_vert.svg';
import RecentTransactionsModal from 'components/RecentTransactionsModal/RecentTransactionsModal';

import styles from './Header.module.scss';

let isChangingAccount = false;

const Header = () => {
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const [settingsModalShowed, setSettingsModalShowed] = useState(false);
  const [transactionsModalShowed, setTransactionsModalShowed] = useState(false);

  useEffect(() => {
    const handleAccountChange = async (accounts: string[]) => {
      isChangingAccount = true;

      window.onfocus = async () => {
        if (isChangingAccount) {
          setTimeout(async () => {
            isChangingAccount = false;
            await setAuthHeaders(accounts[0]);
            // setUser({ account: await getAccount() });
            window.location.reload(); // use page reload for now to avoid complicated logic in other comps.
          }, 500);
        }
      };
    };

    const connect = async () => {
      (window as any).ethereum.on('accountsChanged', handleAccountChange);
      setUser({ account: await getAccount() });
    };

    connect();

    return () => {
      // on unmounting
      (window as any).ethereum.removeListener('accountsChanged', handleAccountChange);
    };
  }, []);

  const ntfItems = [
    <MenuItem key="nfts" icon={<StarIcon />} onClick={() => router.push('/my-nfts')}>
      My NFTs
    </MenuItem>,
    <MenuItem key="listed" icon={<StarIcon />} onClick={() => router.push('/listed-nfts')}>
      Listed for sale
    </MenuItem>
  ];

  const offerItems = [
    <MenuItem key="made" icon={<StarIcon />} onClick={() => router.push('/offers-made')}>
      Offers Made
    </MenuItem>,
    <MenuItem key="received" icon={<StarIcon />} onClick={() => router.push('/offers-received')}>
      Offers Received
    </MenuItem>
  ];

  const transactionItems = [
    <MenuItem key="purchases" icon={<StarIcon />} onClick={() => router.push('/purchases')}>
      Purchases
    </MenuItem>,
    <MenuItem key="sales" icon={<StarIcon />} onClick={() => router.push('/sales')}>
      Sales
    </MenuItem>,
    <MenuItem key="transactions" icon={<StarIcon />} onClick={() => setTransactionsModalShowed(true)}>
      Transactions
    </MenuItem>
  ];

  let accountItems: JSX.Element[] = [];
  if (user?.account) {
    accountItems = [
      <AddressMenuItem key="AddressMenuItem" user={user} />,

      <MenuItem key="Rewards" icon={<StarIcon />} onClick={() => router.push('/rewards')}>
        Rewards
      </MenuItem>,
      <MenuItem key="Settings" icon={<SettingsIcon />} onClick={() => setSettingsModalShowed(true)}>
        Account
      </MenuItem>,

      <MenuDivider key="dd1" />,
      <MenuItem key="Sign out" icon={<ExternalLinkIcon />} onClick={() => setUser(null)}>
        Sign out
      </MenuItem>
    ];
  }

  let accountButton;

  if (user?.account) {
    accountButton = (
      <div style={{ marginLeft: 6 }}>
        <HoverMenuButton
          buttonTitle={`${user?.account.slice(0, 6)}...${user?.account.slice(-4)}`}
          shadow={true}
          arrow={false}
        >
          {accountItems}
        </HoverMenuButton>
      </div>
    );
  } else {
    accountButton = (
      <div style={{ marginLeft: 6 }}>
        <Link href="/connect">
          <div className={styles.connectButton}>
            <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.19.367a14.05 14.05 0 00-6.38 0l-.44.102C3.435 1.153 1.121 3.524.397 6.59c-.53 2.24-.53 4.58 0 6.82.724 3.066 3.038 5.437 5.973 6.12l.44.103c2.101.49 4.279.49 6.38 0l.44-.102c2.935-.684 5.249-3.055 5.973-6.121.53-2.24.53-4.58 0-6.82-.724-3.066-3.038-5.437-5.973-6.12l-.44-.103zm3.066 7.197a5.322 5.322 0 011.197-.077c.438.022.783.382.842.84.143 1.11.143 2.236 0 3.347-.059.457-.404.817-.842.838-.398.02-.8-.005-1.197-.076l-.078-.014c-1.033-.185-1.832-.921-2.102-1.849a2.047 2.047 0 010-1.146c.27-.928 1.069-1.664 2.102-1.849l.078-.014zM5.101 6.641c0-.37.286-.671.639-.671H10c.353 0 .64.3.64.671 0 .371-.287.672-.64.672H5.74c-.353 0-.64-.3-.64-.672z"
                fill="#777"
              />
            </svg>
            Connect
          </div>
        </Link>
      </div>
    );
  }

  const medNavMenu = [
    ...ntfItems,
    <MenuDivider key="d1" />,
    ...offerItems,
    <MenuDivider key="d2" />,
    ...transactionItems
  ];

  const mobileNavMenu = [
    <MenuItem key="explore-menu" icon={<ExternalLinkIcon />} onClick={() => router.push('/explore')}>
      Explore
    </MenuItem>,
    <MenuDivider key="m2" />,
    ...medNavMenu,
    <MenuDivider key="m1" />,
    ...accountItems
  ];

  return (
    <header className={styles.header} onClick={() => {}}>
      <Box className={styles.hdf} display="flex">
        <div className={styles.showLargeLogo}>
          <Link href="/">
            <img
              style={{ flex: '0 1 auto' }}
              className="can-click"
              alt="logo"
              src="/img/nftcompanyTransparentBgSvg.svg"
              width={200}
            />
          </Link>
        </div>
        <div className={styles.showSmallLogo}>
          <Link href="/">
            <img
              style={{ flex: '0 1 auto' }}
              className="can-click"
              alt="logo"
              src="/img/ncTransparentBgSvg.svg"
              width={60}
            />
          </Link>
        </div>

        <Box flex={1} />

        <Box flex={10} pr="2" maxW="360px" minW="100px">
          <ExploreSearch />
        </Box>

        <Box pr="4">
          <div className={styles.links}>
            <div className={styles.showExplore}>
              <div key="Explore" className={styles.exploreButton} onClick={() => router.push('/explore')}>
                Explore
              </div>
            </div>

            <div className={styles.showLargeNav}>
              <div className={styles.linksButtons}>
                <HoverMenuButton buttonTitle="NFTs">{ntfItems}</HoverMenuButton>

                <HoverMenuButton buttonTitle="Offers">{offerItems}</HoverMenuButton>

                <HoverMenuButton buttonTitle="Activity">{transactionItems}</HoverMenuButton>
              </div>
            </div>

            <div className={styles.showMediumNav}>
              <HoverMenuButton buttonTitle="NFTs">
                {[...ntfItems, <MenuDivider key="d1" />, ...offerItems, <MenuDivider key="d2" />, ...transactionItems]}
              </HoverMenuButton>
            </div>

            <div className={styles.showConnectButton}>{accountButton}</div>

            <div className={styles.showMobileMenu}>
              {/* using Image() put space at the bottom */}
              <HoverMenuButton buttonContent={<img src={MoreVert.src} height={32} width={32} />}>
                {mobileNavMenu}
              </HoverMenuButton>
            </div>
          </div>
        </Box>
      </Box>

      {settingsModalShowed && <SettingsModal onClose={() => setSettingsModalShowed(false)} />}
      {transactionsModalShowed && <RecentTransactionsModal onClose={() => setTransactionsModalShowed(false)} />}
    </header>
  );
};

export default Header;
