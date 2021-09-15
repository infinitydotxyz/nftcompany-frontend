import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';
import React from 'react';

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

export const theme = extendTheme({ config, colors });

export const AppChakraProvider = ({ children }: { children: any }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
