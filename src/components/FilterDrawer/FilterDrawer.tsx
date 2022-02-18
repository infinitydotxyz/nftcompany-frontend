import { useState, useEffect } from 'react';
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
  Text,
  IconButton,
  DrawerOverlay,
  Checkbox,
  ChakraProps
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import * as React from 'react';
import { getDefaultFilterState, useSearchContext } from 'utils/context/SearchContext';
import CollectionNameFilter from './CollectionNameFilter';
import { apiGet } from 'utils/apiUtil';
import { LISTING_TYPE, PAGE_NAMES } from 'utils/constants';
import { useAppContext } from 'utils/context/AppContext';
import { renderSpinner } from 'utils/commonUtil';
import TraitList from './TraitList';
import styles from './FilterDrawer.module.scss';

const DEFAULT_MIN_PRICE = 0.0000000001;
const CLEAR_KEY = 'CLEAR';

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

const EmptyTrait = { type: '', value: '', traitData: undefined };

interface Props {
  onToggle?: (isOpen: boolean) => void;
  pageName?: string;
  showSaleTypes?: boolean;
  showPrices?: boolean;
  showCollection?: boolean;
  renderContent?: boolean;
  collection?: string;
  onChange?: (filter: any, isClearing?: boolean) => void;
}

const FilterDrawer = ({
  onToggle,
  pageName,
  showSaleTypes,
  showPrices,
  showCollection,
  collection,
  onChange,
  ...rest
}: Props & ChakraProps) => {
  const { showAppError, headerPosition, chainId } = useAppContext();
  const { filterState, setFilterState } = useSearchContext();
  const [minPriceVal, setMinPriceVal] = useState(
    filterState.priceMin === `${DEFAULT_MIN_PRICE}` ? '' : filterState.priceMin
  );
  const [maxPriceVal, setMaxPriceVal] = useState(filterState.priceMax);
  const [collectionName, setCollectionName] = useState('');
  const [selectedCollectionIds, setSelectedCollectionIds] = useState(collection ?? '');
  const [traits, setTraits] = useState<Trait[]>([]);
  const [selectedTraitType, setSelectedTraitType] = useState<Trait | undefined>(undefined);
  const [selectedTraits, setSelectedTraits] = useState<any[]>([EmptyTrait]);
  const [selectedTraitValue, setSelectedTraitValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile] = useMediaQuery('(max-width: 1024px)'); // same as css .filter-container
  const [isMobileSmall] = useMediaQuery('(max-width: 600px)');
  const [isFetchingTraits, setIsFetchingTraits] = useState(false);

  useEffect(() => {
    if (collection) {
      fetchTraits(collection);
    }
  }, [collection]);

  useEffect(() => {
    handleClickApply(); // apply when user searched & selected collections
  }, [selectedCollectionIds]);

  const getNewFilterState = () => {
    updateTraitFilterState();
    const newFilter = { ...filterState };
    if (newFilter.priceMax) {
      newFilter.priceMin = newFilter.priceMin || DEFAULT_MIN_PRICE.toString();
    }
    newFilter.chainId = chainId;
    newFilter.collectionName = collectionName;
    newFilter.tokenAddresses = selectedCollectionIds === CLEAR_KEY ? [] : selectedCollectionIds.split(',');
    newFilter.collectionIds = selectedCollectionIds === CLEAR_KEY ? '' : selectedCollectionIds;
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
    if (onChange) {
      onChange(newFilter);
    }
  };

  const clearSelectedTraits = () => {
    setSelectedTraits([]);
    setTimeout(() => {
      setSelectedTraits([{ ...EmptyTrait }]);
    }, 10);
  };

  const handleClickClear = () => {
    const emptyFilter = getDefaultFilterState({ ...filterState });
    emptyFilter.collectionIds = collection ?? '';
    emptyFilter.priceMax = '';
    emptyFilter.priceMin = '';
    setMinPriceVal('');
    setMaxPriceVal('');
    setCollectionName('');
    setSelectedCollectionIds(CLEAR_KEY);
    if (pageName !== PAGE_NAMES.COLLECTION) {
      setTraits([]); // don't clear traits for Collection page
    }
    setSelectedTraitValue('');
    setSelectedTraitType(undefined);
    setSelectedTraits([EmptyTrait]);
    clearSelectedTraits();
    emptyFilter.traitType = '';
    emptyFilter.traitValue = '';

    setFilterState(emptyFilter);
    if (onChange) {
      onChange(emptyFilter, true);
    }
  };

  const updateTraitFilterState = () => {
    filterState.traitType = selectedTraits.map((o) => o.type).join(',');
    filterState.traitValue = selectedTraits.map((o) => o.value).join(',');
  };

  const fetchTraits = async (address: string) => {
    setIsFetchingTraits(true);
    const { result, error } = await apiGet(`/collections/${address}/traits`);
    setIsFetchingTraits(false);
    if (result?.traits) {
      console.log('result.traits', result.traits);
      setTraits(result.traits);
      setSelectedTraits([{ ...EmptyTrait }]);
    } else {
      showAppError(`Failed to fetch traits. ${error?.message}`);
    }
  };
  const shouldFetchTraits =
    (pageName === PAGE_NAMES.EXPLORE || pageName === PAGE_NAMES.LISTED_NFTS || pageName === PAGE_NAMES.COLLECTION) &&
    selectedCollectionIds.split(',').length === 1;

  const content = (
    <Box className={styles.main} mt={6}>
      {showSaleTypes === false ? null : (
        <div className={styles.bottomBorder}>
          <Text mb={4} mt={4} align="left">
            Sale Type
          </Text>

          <Box display="flex" flexDirection="column" gridGap={2}>
            <Checkbox
              isChecked={filterState.listType === LISTING_TYPE.FIXED_PRICE}
              onChange={() => handleClickListType('fixedPrice')}
            >
              <Text className={styles.main}>Fixed Price</Text>
            </Checkbox>
            <Checkbox
              isChecked={filterState.listType === LISTING_TYPE.DUTCH_AUCTION}
              onChange={() => handleClickListType('dutchAuction')}
            >
              <Text className={styles.main}>Declining Price</Text>
            </Checkbox>
            <Checkbox
              isChecked={filterState.listType === LISTING_TYPE.ENGLISH_AUCTION}
              onChange={() => handleClickListType('englishAuction')}
            >
              <Text className={styles.main}>On Auction</Text>
            </Checkbox>
          </Box>
        </div>
      )}

      {showPrices === false ? null : (
        <div className={styles.bottomBorder}>
          <Text mb={4} mt={8} align="left">
            Price (ETH)
          </Text>
          <div className={styles.price}>
            <Input
              className={styles.priceInput}
              placeholder={'Min Price'}
              value={minPriceVal}
              onChange={(ev) => {
                setMinPriceVal(ev.target.value);
                filterState.priceMin = ev.target.value;
              }}
            />
            <div className={styles.divider} />

            <Input
              className={styles.priceInput}
              placeholder={'Max Price'}
              value={maxPriceVal}
              onChange={(ev) => {
                setMaxPriceVal(ev.target.value);
                filterState.priceMax = ev.target.value;
              }}
            />
          </div>

          <Box mt={8} textAlign="left">
            <Button variant="outline" onClick={handleClickApply}>
              Apply
            </Button>
            <Button variant="outline" ml={2} onClick={handleClickClear}>
              Clear
            </Button>
          </Box>
        </div>
      )}

      <>
        {showCollection === false ? null : (
          <Text mt={8} mb={4}>
            Collections
          </Text>
        )}

        <Box>
          {showCollection === false ? null : (
            <CollectionNameFilter
              value={selectedCollectionIds}
              onClear={() => {
                setCollectionName('');
                setSelectedCollectionIds(CLEAR_KEY);
                setTraits([]);
                setSelectedTraitValue('');
                setSelectedTraitType(undefined);
              }}
              onChange={(val, address, selectedCollectionIds) => {
                setSelectedCollectionIds(selectedCollectionIds);

                // fetch collection traits
                if (address && shouldFetchTraits) {
                  fetchTraits(address);
                } else {
                  setTraits([]);
                  setSelectedTraitValue('');
                  setSelectedTraitType(undefined);
                  setSelectedTraits([{ ...EmptyTrait }]);
                  filterState.traitType = '';
                  filterState.traitValue = '';
                }
              }}
            />
          )}

          {shouldFetchTraits && isFetchingTraits && renderSpinner({ marginTop: 5 })}
        </Box>

        <TraitList
          traitData={traits}
          onChange={(traitTypes, traitValues) => {
            const newFilter = getNewFilterState();
            newFilter.traitType = traitTypes.join(',');
            newFilter.traitValue = traitValues.join(',');
            setFilterState(newFilter);
          }}
        />
      </>
    </Box>
  );

  // for desktop width => render content directly without Drawer:
  if (!isMobile) {
    return <>{content}</>;
  }

  return (
    <>
      <Box>
        <IconButton
          aria-label=""
          position="fixed"
          width={70}
          top={headerPosition + 12}
          variant="outline"
          colorScheme="gray"
          onClick={() => setIsOpen(!isOpen)}
          zIndex={1}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={() => undefined}
        size={isMobileSmall ? 'full' : 'xs'}
        blockScrollOnMount={false}
        trapFocus={false}
        {...rest}
      >
        <DrawerOverlay backgroundColor="rgba(0,0,0,0)" />

        <DrawerContent shadow="lg" mt={headerPosition + 12}>
          <DrawerHeader display="flex" justifyContent="space-between" alignItems="center">
            <Heading size="sm">Filter</Heading>
            <IconButton aria-label="" variant="ghost" size="lg" colorScheme="gray" onClick={() => setIsOpen(false)}>
              <ArrowBackIcon />
            </IconButton>
          </DrawerHeader>

          <DrawerBody>{content}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
