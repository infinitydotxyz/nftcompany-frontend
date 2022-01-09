import React from 'react';
import { ChakraProvider, theme as baseTheme, extendTheme, ThemeConfig, withDefaultColorScheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { capitalize } from 'lodash';

const brandColor = '#222';

// const brandBlue = '#0000ff'; // #4047ff';
// const brandGray = '#888A8C'; // #4047ff';
const brandBlue = '#4047ff';
const brandGray = '#888A8C';
const darkGray = '#1A202C'; // Gray.800
const darkGrayAlpha = '#1A202Ccc';

const lightBg = '#fcfdfd';
const lightBgAlpha = '#fcfdfdcc';

/**
 * gray used for alt actions buttons
 */
const actionLight = '#E9E9EB';
const hoverActionLight = '#E5E5E5';

/**
 * toggle colors
 */
const inactiveActionLight = '#E5E5E5';
const activeActionLight = '#000000';

const lightText = '#6F6F6F';
const mainFont =
  'Futura, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,  Droid Sans, Helvetica Neue, sans-serif';

export const colors = {
  brandColor, // currently: black #222

  brandBlue,
  brandGray,

  // custom colors
  windowBg: lightBg,
  windowBgDark: darkGray,

  actionLight,
  hoverActionLight,

  inactiveActionLight,
  activeActionLight,

  cardBgLight: '#f3f3f3',
  cardBgDark: '#111',

  // unsure how to add opacity on a css var so we have these variants for now
  headerBg: lightBgAlpha,
  headerBgDark: darkGrayAlpha,

  separator: '#E2E8F0',

  brandBlueAlpha: brandBlue + 'aa',
  brandBlueLight: brandBlue + '14',
  brandBlueShadow: brandBlue + '44',

  brandGreen: '#15a456',
  brandRed: '#A10000',
  brandRedBright: '#D91D19',

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
  },

  grayish: {
    50: brandGray,
    100: brandGray,
    200: brandGray,
    300: brandGray,
    400: brandGray,
    500: brandGray,
    600: brandGray,
    700: brandGray,
    800: brandGray,
    900: brandGray,
    A100: brandGray,
    A200: brandGray,
    A400: brandGray,
    A700: brandGray
  }
};

const Table = {
  parts: ['table', 'thead', 'tr', 'tbody', 'tfoot', 'td'],
  sizes: {
    md: {
      th: {
        px: '6',
        py: '5',
        lineHeight: '4',
        fontSize: 'sm'
      }
    }
  },
  baseStyle: {
    table: {
      // turned this off, it uses an ugly font
      fontVariantNumeric: 'none'
    },
    th: {
      textTransform: capitalize
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

        _focus: { bg: 'var(--chakra-colors-brandColor)', color: 'white' },
        _active: { bg: 'var(--chakra-colors-brandColor)', color: 'white' },

        _hover: { bg: 'var(--chakra-colors-brandColor)', color: 'white' }
      }
    };
  }
};

const Button = {
  baseStyle: (props: any) => {
    return {
      // default is 1.2 and it makes the text a few pixels too high
      lineHeight: '1.0',
      paddingBottom: '4px', // align button text vertically for Futura font.
      fontWeight: 'normal',
      bg: 'var(--chakra-colors-brandColor)',
      backgroundColor: 'var(--chakra-colors-brandColor)',
      _hover: {
        bg: 'none',
        backgroundColor: 'none'
      },
      _active: {
        bg: 'var(--chakra-colors-brandColor)',
        backgroundColor: 'var(--chakra-colors-brandColor)'
      }
    };
  },
  sizes: {
    sm: (props: any) => {
      return {
        fontSize: '12px',
        lineHeight: '14px'
      };
    },
    md: (props: any) => {
      return { fontSize: '12px', lineHeight: '14px' };
    },
    lg: (props: any) => {
      return { fontSize: '16px', lineHeight: '19px', paddingY: '22.5px', paddingX: '16px', minWidth: '157px' };
    }
  },
  variants: {
    outline: (props: any) => {
      return {
        bg: '#fff',
        backgroundColor: '#fff',
        border: '1px solid var(--chakra-colors-brandColor)',
        color: 'var(--chakra-colors-brandColor)',
        _hover: {
          color: '#fff',
          backgroundColor: 'var(--chakra-colors-brandColor)'
        }
      };
    },
    ghost: (props: any) => {
      return {
        bg: '#fff',
        backgroundColor: '#fff'
      };
    },
    solid: (props: any) => {
      const { colorScheme, colorMode } = props;

      // prevent chakra changing the button colors when in dark mode
      if (colorMode === 'dark' && colorScheme !== 'gray' && colorScheme !== 'grayish') {
        return {
          bg: brandColor,
          color: 'white'
        };
      }
    },
    alt: (props: any) => {
      return {
        bg: 'var(--chakra-colors-actionLight)',
        backgroundColor: 'var(--chakra-colors-actionLight)',
        _hover: {
          bg: 'var(--chakra-colors-hoverActionLight)',
          backgroundColor: 'var(--chakra-colors-hoverActionLight)'
        }
      };
    }
  }
};

const FormLabel = {
  baseStyle: (props: any) => {
    return {
      color: '#000000',
      fontStyle: 'normal',
      fontWeight: 'normal'
    };
  },
  sizes: {
    md: {
      fontSize: '12px',
      lineHeight: '14px',
      marginBottom: '16px'
    },
    lg: {
      fontSize: '16px',
      lineHeight: '19px',
      marginBottom: '16px'
    },
    xl: {
      fontSize: '24px',
      lineHeight: '29px',
      marginBottom: '16px'
    },
    '2xl': {
      fontSize: '36px',
      lineHeight: '44px',
      marginBottom: '16px'
    }
  }
};

const Text = {
  sizes: {
    md: {
      fontSize: '12px',
      lineHeight: '14px'
    },
    lg: {
      fontSize: '16px',
      lineHeigt: '19px'
    },
    xl: {
      fontSize: '24px',
      lineHeigt: '29px'
    },
    '2xl': {
      fontSize: '36px',
      lineHeight: '44px'
    }
  },

  variants: {
    bold: () => {
      return {
        fontWeight: 500
      };
    },
    close: () => {
      return { letterSpacing: '-1px' };
    },
    light: () => {
      return {
        fontFamily: 'Helvetica Neue',
        color: '#6f6f6f'
      };
    },
    dark: () => {
      return {
        lineHeight: '140%',
        color: '#000000'
      };
    }
  }
};

const Input = {
  baseStyle: (props: any) => {
    return {
      paddingBottom: '4px' // align button text vertically for Futura font.
    };
  },
  variants: {
    outline: (props: any) => {
      return {
        field: {
          paddingBottom: '4px', // align button text vertically for Futura font.
          border: '1px solid',

          // not sure why you have to set this
          borderColor: '#aaa',

          _hover: {
            border: '1px solid #aaa'
          },
          _focus: {
            borderColor: 'var(--chakra-colors-brandColor)',
            boxShadow: '0 0 0 1px var(--chakra-colors-brandColor)'
          }
        }
      };
    }
  }
};

const Textarea = {
  baseStyle: (props: any) => {
    return {
      paddingBottom: '4px', // align button text vertically for Futura font.
      border: '1px solid',
      borderColor: '#aaa',

      _hover: {
        border: '1px solid #aaa'
      },
      _focus: {
        borderColor: 'var(--chakra-colors-brandColor)',
        boxShadow: '0 0 0 1px var(--chakra-colors-brandColor)'
      }
    };
  },
  defaultProps: {
    size: 'md',
    variant: ''
  }
};

const Link = {
  baseStyle: (props: any) => {
    return {
      color: 'var(--chakra-colors-brandColor)'
    };
  },
  variants: {
    underline: {
      textDecoration: 'underline'
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
        fontFamily: mainFont,
        color: mode('gray.800', 'whiteAlpha.900')(props),

        // bg: mode('white', 'gray.800')(props)
        bg: mode('windowBg', 'windowBgDark')(props)
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
    fonts: {
      heading: mainFont,
      body: mainFont
    },
    config,
    colors,
    styles,
    components: {
      Menu,
      Button,
      Table,
      Input,
      Textarea,
      Link,
      Text,
      FormLabel,
      Drawer: {
        variants: {
          // custom theme for Filter Drawer to allow scrolling/interaction on the main body.
          alwaysOpen: {
            parts: ['dialog, dialogContainer'],
            dialog: {
              pointerEvents: 'auto'
            },
            dialogContainer: {
              pointerEvents: 'none'
            }
          }
        }
      }
    }
  },
  withDefaultColorScheme({ colorScheme: 'black' }),
  baseTheme // optional
);

export const AppChakraProvider = ({ children }: { children: any }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
