import React from 'react';
import { ChakraProvider, theme as baseTheme, extendTheme, ThemeConfig, withDefaultColorScheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const colors = {
  brandBlue: '#4047FF',

  // http://mcg.mbitson.com/#!?mcgpalette0=%234047ff
  blue: {
    50: '#e8e9ff',
    100: '#c6c8ff',
    200: '#a0a3ff',
    300: '#797eff',
    400: '#5d63ff',
    500: '#4047ff',
    600: '#3a40ff',
    700: '#3237ff',
    800: '#2a2fff',
    900: '#1c20ff',
    A100: '#ffffff',
    A200: '#ffffff',
    A400: '#cdcdff',
    A700: '#b3b4ff',
    contrastDefaultColor: 'light'
  }
};

const Menu = {
  parts: ['menu', 'item'],
  baseStyle: {
    item: {
      color: '#333',

      _focus: { bg: 'white', color: '#333' },
      _active: { bg: 'white', color: '#333' },

      _hover: { bg: 'brandBlue', color: 'white' }
    }
  }
};

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'light'
};

const styles = {
  global: (props: any) => {
    // console.log(props);
    return {
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),

        // bg: mode('white', 'gray.800')(props)
        bg: mode('#fcfdfd', 'gray.800')(props)
      },
      '*::placeholder': {
        color: mode('gray.400', 'whiteAlpha.400')(props)
      },
      '*, *::before, &::after': {
        borderColor: mode('gray.200', 'whiteAlpha.300')(props),
        wordWrap: 'break-word'
      }
    };
  }
};

export const theme = extendTheme(
  {
    config,
    colors,
    styles,
    components: {
      Menu
    }
  },
  withDefaultColorScheme({ colorScheme: 'blue' }),
  baseTheme // optional
);

export const AppChakraProvider = ({ children }: { children: any }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
