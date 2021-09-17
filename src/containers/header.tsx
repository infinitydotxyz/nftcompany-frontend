import React, { useEffect } from 'react';
import { MenuItem, MenuDivider, Box, useToast } from '@chakra-ui/react';
import { ExternalLinkIcon, StarIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAccount } from '../../src/utils/ethersUtil';
import { setAuthHeaders } from '../../src/utils/apiUtil';
import NavBar from 'components/NavBar/NavBar';
import { useAppContext } from 'utils/context/AppContext';
import ExploreSearch from 'components/ExploreSearch/ExploreSearch';
import { AddressMenuItem } from 'components/AddressMenuItem/AddressMenuItem';
import { HoverMenuButton } from 'components/HoverMenuButton/HoverMenuButton';

let isChangingAccount = false;

interface ITodo {
  id: number;
  title: string;
  description: string;
  status: boolean;
}

type ContextType = {
  todos: ITodo[];
  saveTodo: (todo: ITodo) => void;
  updateTodo: (id: number) => void;
};

const Header = () => {
  const toast = useToast();
  const router = useRouter();
  const { route } = router;

  const { user, setUser } = useAppContext();
  console.log('- Header - user:', user);

  useEffect(() => {
    const handleAccountChange = async (accounts: string[]) => {
      isChangingAccount = true;

      window.onfocus = async () => {
        if (isChangingAccount) {
          setTimeout(async () => {
            isChangingAccount = false;
            await setAuthHeaders(accounts[0]);
            setUser({ account: await getAccount() });
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
  return (
    <header className="hd-d" onClick={() => {}}>
      <div className="hd-f">
        <div className="container container-fluid">
          <div className="grid align-items-center">
            <Link href="/">
              <a className="logo-link" style={{ position: 'absolute', top: 5, left: 67 }}>
                <Image alt="logo" src="/img/nftcompanyTransparentBgSvg.svg" width={240} height={80} />
              </a>
            </Link>

            <div className="col-lg-1"></div>
            <Box className="col-lg-5 col-12" display="flex">
              <NavBar
                items={[{ title: 'Explore', link: '/explore' }]}
                active={['/explore'].indexOf(route)}
                onClickItem={(item, _) => {
                  router.push(item.link || '');
                }}
              />
              <Box flex="1" mt="2">
                <ExploreSearch />
              </Box>
            </Box>
            <div className="col-12 col-lg-6">
              <ul className="links" style={{ justifyContent: 'space-between' }}>
                {/* <HeaderActionButtons user={user} /> */}

                <HoverMenuButton buttonTitle="NFTs">
                  <MenuItem
                    textColor="#333"
                    icon={<StarIcon />}
                    onClick={() => {
                      return router.push('/my-nfts');
                    }}
                  >
                    My NFTs
                  </MenuItem>
                  <MenuItem textColor="#333" icon={<StarIcon />} onClick={() => router.push('/listed-nfts')}>
                    Listed for sale
                  </MenuItem>
                </HoverMenuButton>

                <HoverMenuButton buttonTitle="Offers">
                  <MenuItem textColor="#333" icon={<StarIcon />} onClick={() => router.push('/offers-made')}>
                    Offers Made
                  </MenuItem>
                  <MenuItem textColor="#333" icon={<StarIcon />} onClick={() => router.push('/offers-received')}>
                    Offers Received
                  </MenuItem>
                </HoverMenuButton>

                <HoverMenuButton buttonTitle="Transactions">
                  <MenuItem textColor="#333" icon={<StarIcon />} onClick={() => router.push('/purchases')}>
                    Purchases
                  </MenuItem>
                  <MenuItem textColor="#333" icon={<StarIcon />} onClick={() => router.push('/sales')}>
                    Sales
                  </MenuItem>
                </HoverMenuButton>

                {user?.account ? (
                  <li>
                    <HoverMenuButton
                      buttonContent={
                        <div className="connect-button">
                          {`${user?.account.slice(0, 6)}...${user?.account.slice(-4)}`}
                        </div>
                      }
                    >
                      <AddressMenuItem user={user} />

                      <MenuItem textColor="#333" icon={<StarIcon />} onClick={() => router.push('/rewards')}>
                        Rewards
                      </MenuItem>

                      <MenuDivider />
                      <MenuItem textColor="#333" icon={<ExternalLinkIcon />} onClick={() => setUser(null)}>
                        Sign out
                      </MenuItem>
                    </HoverMenuButton>
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
                            fill="#777"
                          />
                        </svg>
                        Connect
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
