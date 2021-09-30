import React from 'react';
import NextNprogress from 'nextjs-progressbar';
import { SearchContextProvider } from 'utils/context/SearchContext';
import { AppContextProvider } from 'utils/context/AppContext';
import { AppChakraProvider } from 'utils/themeUtil';
import LandingHeader from './LandingHeader';
import LandingFooter from 'components/LandingFooter/LandingFooter';
import Header from 'components/Header/Header';
import { isLocalhost } from 'utils/commonUtil';

import LogRocket from 'logrocket';
if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

interface IProps {
  children: any;
  landing?: boolean;
}

const Layout: React.FC<IProps> = ({ landing, children }: IProps) => {
  return (
    <>
      <AppChakraProvider>
        <AppContextProvider>
          <SearchContextProvider>
            {(landing && <LandingHeader />) || <Header />}
            <main>{children}</main>
            {landing && <LandingFooter />}

            <NextNprogress
              color="#29D"
              startPosition={0.3}
              stopDelayMs={200}
              height={2}
              showOnShallow={true}
              options={{ showSpinner: false }}
            />
          </SearchContextProvider>
        </AppContextProvider>
      </AppChakraProvider>
    </>
  );
};

export default Layout;
