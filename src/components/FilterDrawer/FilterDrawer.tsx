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
  Heading
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import * as React from 'react';
import { useSearchContext } from 'utils/context/SearchContext';

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

const FilterDrawer = ({ isOpen, setIsOpen }: any) => {
  const { filterState, setFilterState } = useSearchContext();
  const [minPriceVal, setMinPriceVal] = React.useState('');
  const [maxPriceVal, setMaxPriceVal] = React.useState('');
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const btnRef: any = React.useRef();

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
    <React.Fragment>
      <Drawer
        variant="alwaysOpen"
        isOpen={isOpen}
        placement="left"
        onClose={() => setIsOpen(!isOpen)}
        finalFocusRef={btnRef}
        size={isMobile ? 'full' : 'xs'}
        closeOnOverlayClick={false}
        blockScrollOnMount={false}
        trapFocus={false}
      >
        <DrawerContent shadow="sm" mt={85}>
          <DrawerHeader display="flex" justifyContent="space-between" alignItems="center">
            <Heading size="sm">Filter</Heading>
            <Button variant="ghost" size="lg" color="gray.700" onClick={() => setIsOpen(false)}>
              <ArrowBackIcon />
            </Button>
          </DrawerHeader>

          <DrawerBody>
            {/* <Divider /> */}

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
    </React.Fragment>
  );
};

export default FilterDrawer;
