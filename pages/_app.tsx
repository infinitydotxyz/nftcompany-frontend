import '../styles/fonts.css';
import '../styles/globals.css';
import '../styles/globals.scss';
import '../styles/components.scss';
import '../styles/grid.scss';
import '../styles/Typeahead.scss';
import '../styles/DatePicker.scss';

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
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
