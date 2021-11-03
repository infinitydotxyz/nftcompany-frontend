import React from 'react';
import NextNprogress from 'nextjs-progressbar';
import { SearchContextProvider } from 'utils/context/SearchContext';
import { AppContextProvider } from 'utils/context/AppContext';
import { AppChakraProvider } from 'utils/themeUtil';
import LandingFooter from 'components/LandingFooter/LandingFooter';
import Header from 'components/Header/Header';
import { isLocalhost } from 'utils/commonUtil';
import LogRocket from 'logrocket';
import { Background } from 'components/Background/Background';
import FilterDrawer from 'components/FilterDrawer/FilterDrawer';
import { useRouter } from 'next/router';

if (!isLocalhost()) {
  LogRocket.init('0pu9ak/nftco');
}

interface IProps {
  children: any;
  landing?: boolean;
  connect?: boolean;
}

const Layout: React.FC<IProps> = ({ connect, landing, children }: IProps) => {
  const router = useRouter();

  return (
    <>
      <AppChakraProvider>
        <Background />

        <AppContextProvider>
          <SearchContextProvider>
            {/* No header on connect page */}
            {!connect && <Header />}

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
