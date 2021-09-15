import '../styles/globals.css';
import '../styles/grid.css';
import '../styles/fonts.css';
import '../styles/Typeahead.css';
import '../src/components/nft/components.scss';
import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as gtag from '../lib/ga/gtag';
const isProduction = process.env.NODE_ENV === 'production';

const colors = {
  fonts: {
    heading: 'Greycliff',
    body: 'Greycliff'
  },
  brand: {
    500: '#4047FF'
  }
};

const config: ThemeConfig = {
  // useSystemColorMode: true,
  initialColorMode: 'light'
};

const theme = extendTheme({ config, colors });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      /* invoke analytics function only for production */
      if (isProduction) gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const getLayout = (Component as any).getLayout || ((page: NextPage) => page);
  return getLayout(
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
