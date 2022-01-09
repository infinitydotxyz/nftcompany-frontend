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
  Table,
  Th,
  Tr,
  Td,
  Tbody,
  Thead,
  Select,
  Checkbox
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, SmallAddIcon, SmallCloseIcon } from '@chakra-ui/icons';
import * as React from 'react';
import { getDefaultFilterState, useSearchContext } from 'utils/context/SearchContext';
import { useEffect } from 'react';
import CollectionNameFilter from './CollectionNameFilter';
import { apiGet } from 'utils/apiUtil';
import { LISTING_TYPE } from 'utils/constants';
import { useAppContext } from 'utils/context/AppContext';
import styles from './FilterDrawer.module.scss';
import { DownshiftSelect, SelectItem } from './DownshiftSelect';

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

const EmptyTrait = { type: '', value: '', traitData: undefined };

interface Props {
  onToggle?: (isOpen: boolean) => void;
  showCollection?: boolean;
  renderContent?: boolean;
}

const FilterDrawer = ({ onToggle, showCollection, renderContent }: Props) => {
  const { showAppError, headerPosition } = useAppContext();
  const { filterState, setFilterState } = useSearchContext();
  const [minPriceVal, setMinPriceVal] = React.useState(
    filterState.priceMin === `${DEFAULT_MIN_PRICE}` ? '' : filterState.priceMin
  );
  const [maxPriceVal, setMaxPriceVal] = React.useState(filterState.priceMax);
  const [collectionName, setCollectionName] = React.useState('');
  const [collectionAddress, setCollectionAddress] = React.useState('');
  const [selectedCollectionIds, setSelectedCollectionIds] = React.useState('');
  const [traits, setTraits] = React.useState<Trait[]>([]);
  const [selectedTraitType, setSelectedTraitType] = React.useState<Trait | undefined>(undefined);
  const [selectedTraits, setSelectedTraits] = React.useState<any[]>([EmptyTrait]);
  const [selectedTraitValue, setSelectedTraitValue] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  const getNewFilterState = () => {
    updateTraitFilterState();
    const newFilter = { ...filterState };
    if (newFilter.priceMax) {
      newFilter.priceMin = newFilter.priceMin || DEFAULT_MIN_PRICE.toString();
    }
    newFilter.collectionName = collectionName;
    newFilter.tokenAddresses = selectedCollectionIds === 'CLEAR' ? [] : selectedCollectionIds.split(',');
    newFilter.collectionIds = selectedCollectionIds === 'CLEAR' ? '' : selectedCollectionIds;
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

  const handleClickClear = () => {
    const newFilter = getDefaultFilterState({ ...filterState });
    setMinPriceVal('');
    setMaxPriceVal('');
    setCollectionName('');
    setSelectedCollectionIds('CLEAR');
    setTraits([]);
    setSelectedTraitValue('');
    setSelectedTraitType(undefined);
    setSelectedTraits([EmptyTrait]);
    setFilterState(newFilter);
  };

  const updateTraitFilterState = () => {
    filterState.traitType = selectedTraits.map((o) => o.type).join(',');
    filterState.traitValue = selectedTraits.map((o) => o.value).join(',');
  };

  const content = (
    <div className={styles.main}>
      <div className={styles.bottomBorder}>
        <Text mb={4} mt={4}>
          Sale Type
        </Text>

        <Box display="flex" flexDirection="column" gridGap={2}>
          <Checkbox
            colorScheme="blackAlpha"
            isChecked={filterState.listType === LISTING_TYPE.FIXED_PRICE}
            onChange={() => handleClickListType('fixedPrice')}
          >
            Fixed Price
          </Checkbox>
          <Checkbox
            colorScheme="blackAlpha"
            isChecked={filterState.listType === LISTING_TYPE.DUTCH_AUCTION}
            onChange={() => handleClickListType('dutchAuction')}
          >
            Declining Price
          </Checkbox>
          <Checkbox
            colorScheme="blackAlpha"
            isChecked={filterState.listType === LISTING_TYPE.ENGLISH_AUCTION}
            onChange={() => handleClickListType('englishAuction')}
          >
            On Auction
          </Checkbox>
        </Box>
      </div>
      <div className={styles.bottomBorder}>
        <Text mt={8} mb={4}>
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
      </div>

      {showCollection !== false ? (
        <>
          <Text mt={8} mb={4}>
            Collections
          </Text>
          <Box>
            <CollectionNameFilter
              value={selectedCollectionIds}
              onClear={() => {
                setCollectionName('');
                setSelectedCollectionIds('');
                setTraits([]);
                setSelectedTraitValue('');
                setSelectedTraitType(undefined);
              }}
              onChange={async (val, address, selectedCollectionIds) => {
                // setCollectionName(val);
                // setCollectionAddress(address);
                setSelectedCollectionIds(selectedCollectionIds);
                const selectedCollectionIdsArr = selectedCollectionIds.split(',');

                // fetch collection traits
                if (address && selectedCollectionIdsArr.length === 1) {
                  const { result, error } = await apiGet(`/collections/${address}/traits`);
                  if (result?.traits) {
                    setTraits(result.traits);
                    setSelectedTraits([{ ...EmptyTrait }]);
                  } else {
                    showAppError(`Failed to fetch traits. ${error?.message}`);
                  }
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

            {selectedCollectionIds.split(',').length === 1 && traits.length > 0 && (
              <Table size="sm" mt={4}>
                <Thead>
                  <Tr>
                    <Th pl={0}>Attribute</Th>
                    <Th pl={0}>Value</Th>
                    <Th></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {selectedTraits.map((pair, selTraitIdx) => {
                    const selectedTraitValues = selectedTraits[selTraitIdx]?.traitData?.values || [];
                    const traitValueOptions = selectedTraitValues.map((str: string) => ({ label: str, id: str }));

                    const selectedTraitValuesArr: SelectItem[] = selectedTraits[selTraitIdx]?.value
                      ? selectedTraits[selTraitIdx]?.value.split('|').map((str: string) => ({ id: str, label: str }))
                      : [];
                    return (
                      <Tr key={selTraitIdx}>
                        <Td pl={0} pr={1} width={50} border="none">
                          <Select
                            size="sm"
                            placeholder="Type"
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                              const traitType = event.target.value;
                              const traitData = traits.find((t: Trait) => t.trait_type === traitType);
                              setSelectedTraitType(traitData);

                              const newArr = [...selectedTraits];
                              newArr[selTraitIdx].type = traitType;
                              newArr[selTraitIdx].traitData = traitData;
                              setSelectedTraits(newArr);
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

                        <Td pl={0} pr={1} width={140} border="none">
                          <DownshiftSelect
                            placeholder="Trait(s)"
                            isMulti={true}
                            options={traitValueOptions}
                            selectedItems={selectedTraitValuesArr}
                            onChange={(params: SelectItem[]) => {
                              const item = params.slice(-1)[0]; // current item = last item of params array

                              const found = selectedTraitValuesArr.find((obj) => obj.id === item.id);
                              let arr = selectedTraitValuesArr;
                              if (found) {
                                arr = selectedTraitValuesArr.filter((obj) => obj.id !== item.id);
                              } else {
                                arr.push(item);
                              }

                              const newArr = [...selectedTraits];
                              newArr[selTraitIdx].value = arr.map((obj) => obj.id).join('|');
                              setSelectedTraits(newArr);
                            }}
                          />
                        </Td>
                        <Td pl={0} pr={1} d={'flex'} border="none" mt={3}>
                          <SmallCloseIcon
                            className={styles.traitActionIcon}
                            onClick={() => {
                              if (selTraitIdx > 0) {
                                const newArr = selectedTraits.filter((_, index) => index !== selTraitIdx);
                                setSelectedTraits(newArr);
                              } else {
                                setSelectedTraits([]);
                                setTimeout(() => {
                                  setSelectedTraits([{ ...EmptyTrait }]);
                                }, 10);
                              }
                            }}
                          />
                          <SmallAddIcon
                            className={styles.traitActionIcon}
                            onClick={() => {
                              const newArr = [...selectedTraits];
                              newArr.push({ ...EmptyTrait });
                              setSelectedTraits(newArr);
                            }}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
          </Box>
        </>
      ) : null}

      <Box mt={8}>
        <Button variant="outline" onClick={handleClickApply}>
          Apply
        </Button>
        <Button variant="outline" ml={2} onClick={handleClickClear}>
          Clear
        </Button>
      </Box>
    </div>
  );
  if (renderContent === true) {
    return (
      <>
        {/* <Box display="flex" justifyContent="space-between" alignItems="center">
          {isOpen ? <Heading size="sm">Filter</Heading> : null}

          <IconButton aria-label="" variant="ghost" size="lg" colorScheme="gray" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
          </IconButton>
        </Box> */}

        {/* {isOpen ? content : null} */}

        {content}
      </>
    );
  }

  return (
    <>
      {/* <IconButton
        aria-label=""
        position="fixed"
        size="lg"
        top={headerPosition + 24}
        variant="ghost"
        colorScheme="gray"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ArrowForwardIcon />
      </IconButton> */}

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={() => undefined}
        size={isMobile ? 'full' : 'xs'}
        blockScrollOnMount={false}
        trapFocus={false}
      >
        {/* <DrawerOverlay backgroundColor="rgba(0,0,0,0)" /> */}

        <DrawerContent shadow="lg" mt={headerPosition + 12}>
          {/* <DrawerHeader display="flex" justifyContent="space-between" alignItems="center">
            <Heading size="sm">Filter</Heading>
            <IconButton aria-label="" variant="ghost" size="lg" colorScheme="gray" onClick={() => setIsOpen(false)}>
              <ArrowBackIcon />
            </IconButton>
          </DrawerHeader> */}

          <DrawerBody>{content}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterDrawer;
