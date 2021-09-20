import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';
import React from 'react';

const colors = {
  fonts: {
    heading: 'Greycliff',
    body: 'Greycliff'
  },

  brandBlue: '#4047FF'
};

const Menu = {
  parts: ['menu', 'item'],
  baseStyle: {
    item: {
      color: '#333',

      _hover: { bg: 'brandBlue', color: 'white' }
    }
  }
};

const config: ThemeConfig = {
  // useSystemColorMode: true,
  initialColorMode: 'light'
};

export const theme = extendTheme({
  config,
  colors,
  components: {
    Menu
  }
});

export const AppChakraProvider = ({ children }: { children: any }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
