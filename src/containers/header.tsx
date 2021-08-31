import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FilterContext } from 'hooks/useFilter';
import { useRouter } from 'next/router';
import { getAccount, getProvider } from '../../src/utils/ethersUtil';
import ActionModal from 'components/ActionModal/ActionModal';

import HeaderActionButtons from './header/HeaderActionButtons';
import NFT from 'components/nft/nft';
import CardList from 'components/Card/CardList';
import { sampleData } from '../../src/utils/apiUtil';
import { Select } from '@chakra-ui/react';

const Header = () => {
  const router = useRouter();
  const { route } = router;
  const [user, setUser] = useState<any>(null);
  const { filter, setFilter } = useContext<any>(FilterContext);
  console.log('filter', filter);

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
            <div className="col-sm-12 col-md-4 d-flex">
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
                <input
                  className="hd-db-input"
                  placeholder="Search items..."
                  type="text"
                  onChange={(ev) => setFilter({ search: ev.target.value })}
                />
              </div> */}
            </div>

            <div className="col-sm-12 col-md-8">
              <HeaderActionButtons user={user} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
