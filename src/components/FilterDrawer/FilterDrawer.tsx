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
  DrawerOverlay,
  Table,
  Th,
  Tr,
  Td,
  Tbody,
  Tfoot,
  Thead,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import * as React from 'react';
import { useSearchContext } from 'utils/context/SearchContext';
import { useEffect } from 'react';
import CollectionNameFilter from './CollectionNameFilter';
import { apiGet } from 'utils/apiUtil';

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
  const [collectionName, setCollectionName] = React.useState('');
  const [collectionAddress, setCollectionAddress] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    const showDrawer = localStorage.getItem('didShowDrawerFirstTime');

    if (showDrawer !== 'true') {
      setIsOpen(true);

      localStorage.setItem('didShowDrawerFirstTime', 'true');
    }
  }, []);

  const getNewFilterState = () => {
    const newFilter = { ...filterState };
    if (newFilter.priceMax) {
      newFilter.priceMin = newFilter.priceMin || DEFAULT_MIN_PRICE.toString();
    }
    newFilter.collectionName = collectionName;
    return newFilter;
  };

  const handleClickListType = (listType: '' | 'BUY_NOW' | 'AUCTION') => {
    let newListType = listType;
    if (listType === filterState.listType) {
      newListType = '';
    }
    const newFilter = getNewFilterState();
    newFilter.listType = newListType;
    setFilterState(newFilter);
  };

  const handleClickApply = () => {
    const newFilter = getNewFilterState();
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
    setCollectionName('');
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
              onClick={() => handleClickListType('BUY_NOW')}
            >
              Buy Now
            </Button>
            <Button
              {...buttonProps2}
              ml={4}
              isActive={filterState.listType === 'AUCTION'}
              onClick={() => handleClickListType('AUCTION')}
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

            <Heading size="sm" mt={8} mb={4}>
              Collections
            </Heading>
            <Box>
              <CollectionNameFilter
                onChange={async (val, address) => {
                  setCollectionName(val);
                  setCollectionName(address);
                  const { result, error } = await apiGet(`/collections/${address}/traits`);
                  if (error) {
                    // showAppError(error?.message);
                  } else {
                    // setData(result?.listings || []);
                    console.log('traits', result);
                  }
                }}
              />

              {/* <Input placeholder="Search by name..." /> */}

              <Table size="sm" mt={4}>
                <Thead>
                  <Tr>
                    <Th>Attributes</Th>
                    <Th>Values</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Face</Td>
                    <Td>
                      <HStack spacing={4}>
                        {['sm'].map((size) => (
                          <Tag size={size} key={size} borderRadius="full" variant="solid" colorScheme="gray">
                            <TagLabel>Happy</TagLabel>
                            <TagCloseButton />
                          </Tag>
                        ))}
                        {['sm'].map((size) => (
                          <Tag size={size} key={size} borderRadius="full" variant="solid" colorScheme="gray">
                            <TagLabel>Sad</TagLabel>
                            <TagCloseButton />
                          </Tag>
                        ))}
                      </HStack>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Hair</Td>
                    <Td>
                      <HStack spacing={4}>
                        {['sm'].map((size) => (
                          <Tag size={size} key={size} borderRadius="full" variant="solid" colorScheme="gray">
                            <TagLabel>Black</TagLabel>
                            <TagCloseButton />
                          </Tag>
                        ))}
                      </HStack>
                    </Td>
                  </Tr>
                  <Tr color="gray.400">
                    <Td>Name ▼</Td>
                    <Td>Values ▼</Td>
                  </Tr>
                </Tbody>
              </Table>
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
