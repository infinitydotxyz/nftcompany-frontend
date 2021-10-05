import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MenuToggler from 'components/MenuToggler/MenuToggler';
import { scrollTo } from 'utils/scroll';
import { useColorMode } from '@chakra-ui/react';

const LandingHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { colorMode } = useColorMode();

  const toggleMenu = () => {
    setMobileMenuOpen((state) => !state);
  };

  const dark = colorMode === 'dark';

  return (
    <header className="header header-l">
      <div className="container">
        <div className="grid align-items-center">
          <div className="col-sm-8 col-md-3">
            <Link href="/">
              <a>
                <Image
                  alt="Infinity"
                  src={dark ? '/img/nftcompanyDarkModeLogo.svg' : '/img/infinity.svg'}
                  width={270}
                  height={90}
                />
              </a>
            </Link>
          </div>
          <div className="d-md-none">
            <div
              style={{
                position: 'absolute',
                right: 20,
                top: 40
              }}
            >
              <MenuToggler isActive={mobileMenuOpen} onClick={toggleMenu} />
            </div>
          </div>
          <div className="col-sm-12 col-md-9 header-links-wrapper">
            <ul className="header-links">
              <li>
                <a href="https://docs.nftcompany.com" target="_blank" rel="noreferrer">
                  Docs
                </a>
              </li>
              <li>
                <a href="https://github.com/mavriklabs" target="_blank" rel="noreferrer">
                  Github
                </a>
              </li>
              <li>
                <a href="https://medium.com/@mavriklabs" target="_blank" rel="noreferrer">
                  Medium
                </a>
              </li>
              <li>
                <a href="https://discord.gg/SefzVZU72S" target="_blank" rel="noreferrer">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://twitter.com/mavriklabs" target="_blank" rel="noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a onClick={() => scrollTo({ id: 'faq' })}>FAQ</a>
              </li>
            </ul>
          </div>

          {/* <div className="col-sm-12 col-md-3 justify-self-end">
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
              Connect Wallet
            </a>
            </Link>
          </div> */}
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="header-links-mobile-wrapper">
          <ul className="header-links header-links-mobile">
            <li>
              <a href="https://docs.nftcompany.com" target="_blank" rel="noreferrer">
                Docs
              </a>
            </li>
            <li>
              <a href="https://github.com/mavriklabs" target="_blank" rel="noreferrer">
                Github
              </a>
            </li>
            <li>
              <a href="https://medium.com/@mavriklabs" target="_blank" rel="noreferrer">
                Medium
              </a>
            </li>
            <li>
              <a href="https://discord.gg/SefzVZU72S" target="_blank" rel="noreferrer">
                Discord
              </a>
            </li>
            <li>
              <a href="https://twitter.com/mavriklabs" target="_blank" rel="noreferrer">
                Twitter
              </a>
            </li>
            <li>
              <a onClick={() => scrollTo({ id: 'faq' })}>FAQ</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
