import '../styles/globals.css';
import '../styles/grid.css';
import '../styles/page.scss';
import '../styles/fonts.css';
import '../styles/Typeahead.css';
import '../src/components/nft/components.scss';
import { AppChakraProvider } from 'utils/themeUtil';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import * as gtag from '../lib/ga/gtag';
const isProduction = process.env.NODE_ENV === 'production';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      /* invoke analytics function only for production */
      if (isProduction) {
        gtag.pageview(url);
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const getLayout = (Component as any).getLayout || ((page: NextPage) => page);
  return getLayout(
    <AppChakraProvider>
      <Component {...pageProps} />
    </AppChakraProvider>
  );
}

export default MyApp;
