import React, { useEffect, useState } from 'react';
import { MenuItem, MenuDivider, Box, useColorMode, Alert, AlertIcon, CloseButton } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { saveAuthHeaders } from '../../../src/utils/apiUtil';
import { useAppContext } from 'utils/context/AppContext';
import { AddressMenuItem } from 'components/AddressMenuItem/AddressMenuItem';
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';
import SettingsModal from 'components/SettingsModal/SettingsModal';
import { ellipsisAddress } from 'utils/commonUtil';
import { EthToken, MoreVertIcon } from 'components/Icons/Icons';
import SearchBox from '../SearchBox/SearchBox';

import styles from './Header.module.scss';
import { DarkmodeSwitch } from 'components/DarkmodeSwitch/DarkmodeSwitch';
import { MenuIcons } from 'components/Icons/MenuIcons';

let isChangingAccount = false;

const Header = (): JSX.Element => {
  const router = useRouter();
  const { user, signIn, signOut } = useAppContext();
  const [settingsModalShowed, setSettingsModalShowed] = useState(false);
  const [lockout, setLockout] = useState(false);
  const [closedLockout, setClosedLockout] = useState(false);

  const { colorMode } = useColorMode();

  const signedIn = !!user?.account;

  useEffect(() => {
    const handleAccountChange = async (accounts: string[]) => {
      isChangingAccount = true;

      window.onfocus = async () => {
        if (isChangingAccount) {
          setTimeout(async () => {
            isChangingAccount = false;
            await saveAuthHeaders(accounts[0]);

            // reload below makes this worthless. code left for documentation
            // if we didn't page reload, we would signIn again
            // signIn();

            // use page reload for now to avoid complicated logic in other comps.
            window.location.reload();
          }, 500);
        }
      };
    };

    const handleNetworkChange = (chainId: string) => {
      window.location.reload();
    };

    const getChainId = async () => {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== '0x1') {
          /* todo: adi polymain; do not remove this comment */
          setLockout(true);
        }
      } catch (err) {
        console.error('eth_chainId failed', err);
      }
    };

    signIn();

    if (window?.ethereum) {
      getChainId();

      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('chainChanged', handleNetworkChange);
    }

    return () => {
      // on unmounting
      if (window?.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
        window.ethereum.removeListener('chainChanged', handleNetworkChange);
      }
    };
  }, []);

  const ntfItems = [
    <MenuItem key="nfts" icon={MenuIcons.imageIcon} onClick={() => router.push('/my-nfts')}>
      All NFTs
    </MenuItem>,
    <MenuItem key="listed" icon={MenuIcons.cartIcon} onClick={() => router.push('/listed-nfts')}>
      Listed for sale
    </MenuItem>
  ];

  const offerItems = [
    <MenuItem key="made" icon={MenuIcons.offerIcon} onClick={() => router.push('/offers-made')}>
      Offers Made
    </MenuItem>,
    <MenuItem key="received" icon={MenuIcons.addCartIcon} onClick={() => router.push('/offers-received')}>
      Offers Received
    </MenuItem>
  ];

  const exploreItems = [
    <MenuItem key="made" icon={MenuIcons.exploreIcon} onClick={() => router.push('/explore')}>
      Explore
    </MenuItem>,
    <MenuItem key="received" icon={MenuIcons.collectionsIcon} onClick={() => router.push('/collections')}>
      Verified Collections
    </MenuItem>
  ];

  const transactionItems = [
    <MenuItem key="activity" icon={MenuIcons.listIcon} onClick={() => router.push('/activity')}>
      Activity
    </MenuItem>
  ];

  let accountItems: JSX.Element[] = [];
  if (signedIn) {
    accountItems = [
      <AddressMenuItem key="AddressMenuItem" user={user} />,
      <MenuDivider key="kdd" />,

      ...transactionItems,
      <MenuDivider key="ggdd" />,

      <MenuItem key="Settings" icon={MenuIcons.settings} onClick={() => setSettingsModalShowed(true)}>
        Account
      </MenuItem>,

      <MenuDivider key="dd1" />,
      <MenuItem
        key="Sign out"
        icon={MenuIcons.externalLinkIcon}
        onClick={() => {
          signOut();
        }}
      >
        Sign out
      </MenuItem>
    ];
  }

  let accountButton;

  if (signedIn) {
    accountButton = (
      <HoverMenuButton buttonTitle={ellipsisAddress(user?.account)} shadow={true} arrow={false}>
        {accountItems}
      </HoverMenuButton>
    );
  } else {
    accountButton = (
      <Link href="/connect" passHref>
        <div className={styles.connectButton}>
          <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.19.367a14.05 14.05 0 00-6.38 0l-.44.102C3.435 1.153 1.121 3.524.397 6.59c-.53 2.24-.53 4.58 0 6.82.724 3.066 3.038 5.437 5.973 6.12l.44.103c2.101.49 4.279.49 6.38 0l.44-.102c2.935-.684 5.249-3.055 5.973-6.121.53-2.24.53-4.58 0-6.82-.724-3.066-3.038-5.437-5.973-6.12l-.44-.103zm3.066 7.197a5.322 5.322 0 011.197-.077c.438.022.783.382.842.84.143 1.11.143 2.236 0 3.347-.059.457-.404.817-.842.838-.398.02-.8-.005-1.197-.076l-.078-.014c-1.033-.185-1.832-.921-2.102-1.849a2.047 2.047 0 010-1.146c.27-.928 1.069-1.664 2.102-1.849l.078-.014zM5.101 6.641c0-.37.286-.671.639-.671H10c.353 0 .64.3.64.671 0 .371-.287.672-.64.672H5.74c-.353 0-.64-.3-.64-.672z"
              fill="#333"
            />
          </svg>
          Connect
        </div>
      </Link>
    );
  }

  const medNavMenu = [...ntfItems, <MenuDivider key="d1" />, ...offerItems];

  const mobileNavMenu = () => {
    let result = [
      <MenuItem key="explore-menu" icon={MenuIcons.imageSearchIcon} onClick={() => router.push('/explore')}>
        Explore
      </MenuItem>,
      <MenuItem key="collections" icon={MenuIcons.collectionsIcon} onClick={() => router.push('/collections')}>
        Collections
      </MenuItem>
    ];

    if (signedIn) {
      result.push(
        <MenuItem key="Rewards" icon={MenuIcons.starIcon} onClick={() => router.push('/rewards')}>
          Rewards
        </MenuItem>
      );

      result = result.concat([<MenuDivider key="m2" />, ...medNavMenu, <MenuDivider key="m1" />, ...accountItems]);
    } else {
      result.push(
        <MenuItem key="Connect" icon={MenuIcons.signInIcon} onClick={() => router.push('/connect')}>
          Connect
        </MenuItem>
      );
    }

    return result;
  };

  const dark = colorMode === 'dark';
  let lockoutComponent;

  if (lockout && !closedLockout) {
    lockoutComponent = (
      <Alert className={styles.lockout} status="error">
        <AlertIcon />
        You must be on Ethereum Mainnet {/* todo: adi polymain; do not remove this comment */}
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={() => {
            setClosedLockout(true);
          }}
        />
      </Alert>
    );
  }

  return (
    <header className={styles.header}>
      <Box className={styles.hdf}>
        <div className="page-container-header">
          <div className={styles.showLargeLogo}>
            <Link href="/" passHref>
              <img
                style={{ flex: '0 1 auto', minHeight: 68 }}
                className="can-click"
                alt="logo"
                src={dark ? '/img/logo-dark-mode.svg' : '/img/logo-light-mode.svg'}
                width={180}
              />
            </Link>
          </div>
          <div className={styles.showSmallLogo}>
            <Link href="/" passHref>
              <img style={{ flex: '0 1 auto' }} className="can-click" alt="logo" src="/img/logo-mini.svg" width={60} />
            </Link>
          </div>

          <Box flex={1} />

          <Box flex={10} pr="2" maxW="400px" minW="100px">
            {/* <ExploreSearch /> */}
            <SearchBox />
          </Box>

          <div className={styles.links}>
            <div className={styles.showExplore}>
              <HoverMenuButton buttonTitle="Explore" onClick={() => router.push('/explore')}>
                {exploreItems}
              </HoverMenuButton>
            </div>

            <div className={styles.showLargeNav}>
              <HoverMenuButton disabled={!signedIn} buttonTitle="My NFTs" onClick={() => router.push('/my-nfts')}>
                {medNavMenu}
              </HoverMenuButton>
            </div>

            <div className={styles.showMediumNav}>
              <HoverMenuButton disabled={!signedIn} buttonTitle="My NFTs" onClick={() => router.push('/my-nfts')}>
                {medNavMenu}
              </HoverMenuButton>
            </div>

            {signedIn && (
              <div className={styles.showExplore}>
                <div key="Rewards" className={styles.exploreButton} onClick={() => router.push('/rewards')}>
                  Rewards
                </div>
              </div>
            )}

            <div className={styles.showConnectButton}>{accountButton}</div>

            <div className={styles.showMobileMenu}>
              {/* using Image() put space at the bottom */}
              <HoverMenuButton buttonContent={<MoreVertIcon />}>{mobileNavMenu()}</HoverMenuButton>
            </div>
          </div>
        </div>
      </Box>

      {settingsModalShowed && <SettingsModal onClose={() => setSettingsModalShowed(false)} />}
      {lockoutComponent}
      {<DarkmodeSwitch />}
    </header>
  );
};

export default Header;
