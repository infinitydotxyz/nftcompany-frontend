import {
  Box,
  Button,
  Input,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useMediaQuery,
  ButtonProps,
  Heading,
  IconButton,
  DrawerOverlay
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import * as React from 'react';
import { useSearchContext } from 'utils/context/SearchContext';
import { useEffect } from 'react';

const DEFAULT_MIN_PRICE = 0.0000000001;

const normalButtonProps: ButtonProps = {
  colorScheme: 'gray',
  variant: 'outline',
  fontWeight: 'normal',
  width: 120
};

const activeButtonProps: ButtonProps = {
  colorScheme: 'blue',
  fontWeight: 'normal',
  width: 120
};

const FilterDrawer = () => {
  const { filterState, setFilterState } = useSearchContext();
  const [minPriceVal, setMinPriceVal] = React.useState('');
  const [maxPriceVal, setMaxPriceVal] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const showDrawer = localStorage.getItem('didShowDrawerFirstTime');

    if (showDrawer !== 'true') {
      setIsOpen(true);

      localStorage.setItem('didShowDrawerFirstTime', 'true');
    }
  }, []);

  const handleClickStatus = (listType: '' | 'BUY_NOW' | 'AUCTION') => {
    let newListType = listType;
    if (listType === filterState.listType) {
      newListType = '';
    }

    const newFilter = { ...filterState };
    newFilter.listType = newListType;
    if (newFilter) {
      newFilter.priceMin = newFilter.priceMin || DEFAULT_MIN_PRICE.toString();
    }
    setFilterState(newFilter);
  };

  const handleClickApply = () => {
    const newFilter = { ...filterState };
    if (newFilter.priceMax) {
      newFilter.priceMin = newFilter.priceMin || DEFAULT_MIN_PRICE.toString();
    }
    setFilterState(newFilter);
  };

  const handleClickClearPrices = () => {
    const newFilter = { ...filterState };
    newFilter.listType = '';
    newFilter.priceMin = '';
    newFilter.priceMax = '';
    setFilterState(newFilter);
    setMinPriceVal('');
    setMaxPriceVal('');
  };

  const buttonProps = filterState.listType === 'BUY_NOW' ? activeButtonProps : normalButtonProps;
  const buttonProps2 = filterState.listType === 'AUCTION' ? activeButtonProps : normalButtonProps;

  return (
    <>
      <IconButton
        aria-label=""
        position="fixed"
        size="lg"
        top={100}
        variant="ghost"
        colorScheme="gray"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ArrowForwardIcon />
      </IconButton>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={() => setIsOpen(!isOpen)}
        size={isMobile ? 'full' : 'xs'}
        blockScrollOnMount={false}
        trapFocus={false}
      >
        <DrawerOverlay backgroundColor="rgba(0,0,0,0)" />

        <DrawerContent shadow="lg" mt={88}>
          <DrawerHeader display="flex" justifyContent="space-between" alignItems="center">
            <Heading size="sm">Filter</Heading>
            <IconButton aria-label="" variant="ghost" size="lg" colorScheme="gray" onClick={() => setIsOpen(false)}>
              <ArrowBackIcon />
            </IconButton>
          </DrawerHeader>

          <DrawerBody>
            <Heading size="sm" mb={4}>
              Sale Type
            </Heading>
            <p />
            <Button
              {...buttonProps}
              isActive={filterState.listType === 'BUY_NOW'}
              onClick={() => handleClickStatus('BUY_NOW')}
            >
              Buy Now
            </Button>
            <Button
              {...buttonProps2}
              ml={4}
              isActive={filterState.listType === 'AUCTION'}
              onClick={() => handleClickStatus('AUCTION')}
            >
              On Auction
            </Button>

            <Heading size="sm" mt={8} mb={4}>
              Price (ETH)
            </Heading>
            <Box>
              <Input
                variant="outline"
                placeholder={'Min Price'}
                width={120}
                value={minPriceVal}
                onChange={(ev) => {
                  setMinPriceVal(ev.target.value);
                  filterState.priceMin = ev.target.value;
                }}
              />
              <Input
                variant="outline"
                ml={4}
                placeholder={'Max Price'}
                width={120}
                value={maxPriceVal}
                onChange={(ev) => {
                  setMaxPriceVal(ev.target.value);
                  filterState.priceMax = ev.target.value;
                }}
              />
            </Box>
            <Box mt={8}>
              <Button variant="outline" onClick={handleClickApply}>
                Apply
              </Button>
              <Button variant="outline" color="gray.500" ml={2} onClick={handleClickClearPrices}>
                Clear
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
