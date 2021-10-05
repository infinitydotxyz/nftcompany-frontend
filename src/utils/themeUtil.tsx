import React from 'react';
import { ChakraProvider, theme as baseTheme, extendTheme, ThemeConfig, withDefaultColorScheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const brandBlue = '#4047ff';
const darkGray = '#1A202C'; // Gray.800
const darkGrayAlpha = '#1A202Ccc';

const lightBg = '#fcfdfd';
const lightBgAlpha = '#fcfdfdcc';

const colors = {
  brandBlue: brandBlue,

  // custom colors
  windowBg: lightBg,
  windowBgDark: darkGray,

  cardBgLight: '#f3f3f3',
  cardBgDark: 'black',

  // unsure how to add opacity on a css var so we have these variants for now
  headerBg: lightBgAlpha,
  headerBgDark: darkGrayAlpha,

  brandBlueAlpha: '#4047ffaa',
  brandBlueLight: '#4047ff14',
  brandBlueShadow: '#4047ff44',

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

const Table = {
  baseStyle: {
    table: {
      // turned this off, it uses an ugly font
      fontVariantNumeric: 'none'
    }
  }
};

const Menu = {
  parts: ['menu', 'item'],
  baseStyle: (props: any) => {
    const { baseStyle } = baseTheme.components.Menu;
    const baseStyles = baseStyle(props);

    const bg = mode('white', baseStyles.list?.bg)(props);
    const textColor = mode('var(--text-primary)', 'white')(props);

    return {
      item: {
        color: textColor,

        _focus: { bg: bg, color: textColor },
        _active: { bg: bg, color: textColor },

        _hover: { bg: 'brandBlue', color: 'white' }
      }
    };
  }
};

const Button = {
  baseStyle: (props: any) => {
    return {
      // default is 1.2 and it makes the text a few pixels too high
      lineHeight: '1.0'
    };
  },
  variants: {
    solid: (props: any) => {
      const { colorScheme, colorMode } = props;

      // prevent chakra changing the button colors when in dark mode
      if (colorMode === 'dark' && colorScheme !== 'gray') {
        return {
          bg: brandBlue,
          color: 'white'
        };
      }
    }
  }
};

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'light'
};

const styles = {
  global: (props: any) => {
    return {
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),

        // bg: mode('white', 'gray.800')(props)
        bg: mode('windowBg', 'gray.800')(props)
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
      Menu,
      Button,
      Table
    }
  },
  withDefaultColorScheme({ colorScheme: 'blue' }),
  baseTheme // optional
);

export const AppChakraProvider = ({ children }: { children: any }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
