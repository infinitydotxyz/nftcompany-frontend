import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAccount } from '../../src/utils/ethersUtil';

const Header = () => {
  const router = useRouter();
  const { route } = router;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const connect = async () => {
      const account = await getAccount();
      setUser({ account });
    };
    connect();
  }, []);
  return (
    <header className="hd-d">
      <div className="hd-f">
        <div className="container container-fluid">
          <div className="grid align-items-center">
            <div className="col-sm-12 col-md-6 d-flex">
              <div style={{ width: 480, height: 0 }}></div>
              <Link href="/">
                <a className="logo-link" style={{ position: 'absolute', top: 2, left: 67 }}>
                  {/* TODO: use logo image without padding and align center for this */}
                  <Image alt="logo" src="/img/nftcompanyTransparentBgSvg.svg" width={240} height={80} />
                </a>
              </Link>

              {/* TODO: add Search once we have data store */}
              {/* <div className="hd-db">
                <div className="hd-db-l">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M22 22L20 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
                <input className="hd-db-input" placeholder="Search items, collections, packages, ..." type="text" />
              </div> */}
            </div>

            <div className="col-sm-12 col-md-6">
              <ul className="links">
                <li className={route === '/explore' ? 'active-link' : ''}>
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
                </li>
                {/* <li>FAQs</li> */}

                {user?.account ? (
                  <li>
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
