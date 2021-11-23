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
  Thead,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Select
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import * as React from 'react';
import { useSearchContext } from 'utils/context/SearchContext';
import { useEffect } from 'react';
import CollectionNameFilter from './CollectionNameFilter';
import { apiGet } from 'utils/apiUtil';
import { LISTING_TYPE } from 'utils/constants';

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

type Trait = {
  trait_count: number;
  trait_type: string;
  value: string;
  values: string[];
};

const FilterDrawer = () => {
  const { filterState, setFilterState } = useSearchContext();
  const [minPriceVal, setMinPriceVal] = React.useState('');
  const [maxPriceVal, setMaxPriceVal] = React.useState('');
  const [collectionName, setCollectionName] = React.useState('');
  const [collectionAddress, setCollectionAddress] = React.useState('');
  const [traits, setTraits] = React.useState<Trait[]>([]);
  const [selectedTraitType, setSelectedTraitType] = React.useState<Trait | undefined>(undefined);
  const [selectedTraitValue, setSelectedTraitValue] = React.useState('');
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

  const handleClickListType = (listType: '' | 'fixedPrice' | 'englishAuction' | 'dutchAuction') => {
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
    newFilter.collectionName = '';
    newFilter.traitType = '';
    newFilter.traitValue = '';
    setMinPriceVal('');
    setMaxPriceVal('');
    setCollectionName('');
    setTraits([]);
    setSelectedTraitType(undefined);
    setFilterState(newFilter);
  };

  const buttonProps = filterState.listType === LISTING_TYPE.FIXED_PRICE ? activeButtonProps : normalButtonProps;
  const buttonProps2 = filterState.listType === LISTING_TYPE.DUTCH_AUCTION ? activeButtonProps : normalButtonProps;
  const buttonProps3 = filterState.listType === LISTING_TYPE.ENGLISH_AUCTION ? activeButtonProps : normalButtonProps;

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
              isActive={filterState.listType === LISTING_TYPE.FIXED_PRICE}
              onClick={() => handleClickListType('fixedPrice')}
            >
              Fixed Price
            </Button>
            <Button
              {...buttonProps2}
              ml={4}
              isActive={filterState.listType === LISTING_TYPE.DUTCH_AUCTION}
              onClick={() => handleClickListType('dutchAuction')}
            >
              Declining Price
            </Button>
            <br/>
            <Button
              {...buttonProps3}
              ml={4}
              isActive={filterState.listType === LISTING_TYPE.ENGLISH_AUCTION}
              onClick={() => handleClickListType('englishAuction')}
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
                value={collectionName}
                onClear={() => {
                  setCollectionName('');
                  setTraits([]);
                  setSelectedTraitType(undefined);
                }}
                onChange={async (val, address) => {
                  setCollectionName(val);
                  setCollectionAddress(address);
                  // fetch collection traits
                  if (address) {
                    const { result, error } = await apiGet(`/collections/${address}/traits`);
                    if (error) {
                      // showAppError(error?.message);
                    } else {
                      setTraits(result.traits);
                    }
                  }
                }}
              />

              {traits.length > 0 && (
                <Table size="sm" mt={4}>
                  <Thead>
                    <Tr>
                      <Th>Attribute</Th>
                      <Th>Value</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    <Tr>
                      <Td>
                        <Select
                          size="sm"
                          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            const traitType = event.target.value;
                            const trait = traits.find((t: Trait) => t.trait_type === traitType);
                            setSelectedTraitType(trait);
                          }}
                        >
                          <option value=""></option>
                          {traits.map((item: any) => {
                            return (
                              <option key={item.trait_type} value={item.trait_type}>
                                {item.trait_type}
                              </option>
                            );
                          })}
                        </Select>
                      </Td>

                      <Td>
                        {selectedTraitType && (
                          <Select
                            size="sm"
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                              const traitValue = event.target.value;
                              setSelectedTraitValue(traitValue);
                              filterState.traitType = selectedTraitType.trait_type;
                              filterState.traitValue = traitValue;
                            }}
                          >
                            <option value=""></option>
                            {selectedTraitType.values.map((val: string) => {
                              return (
                                <option key={val} value={val}>
                                  {val}
                                </option>
                              );
                            })}
                          </Select>
                        )}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              )}
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
