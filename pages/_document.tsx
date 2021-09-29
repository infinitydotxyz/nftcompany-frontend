import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { GA_TRACKING_ID } from '../lib/ga/gtag';
import { theme } from 'utils/themeUtil';

const isProduction = process.env.NODE_ENV === 'production';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Warning: viewport meta tags should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-viewport-meta */}
          {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
          <meta name="probely-verification" content="2c96190a-327b-4ea0-b205-59e2b4511817" />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {isProduction && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    });
                    `
                }}
              />
            </>
          )}
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
