import React from 'react';
import Downshift from 'downshift';
import { Box, Input } from '@chakra-ui/react';
import { getTypeAheadOptions } from 'services/Listings.service';
import { CloseIcon } from '@chakra-ui/icons';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';

import styles from './CollectionNameFilter.module.scss';
import { uniqBy } from 'lodash';

type SearchMatch = {
  value: string;
  label: string;
  type: 'Asset' | 'Collection';
  address?: string;
  hasBlueCheck?: boolean;
};

type CollectionNameFilterProps = {
  value: string;
  onClear: () => void;
  onChange: (value: string, address: string, collectionIds: string) => void;
};

export default function CollectionNameFilter({ value, onClear, onChange }: CollectionNameFilterProps) {
  const [options, setOptions] = React.useState<SearchMatch[]>([]);
  const [isSelecting, setIsSelecting] = React.useState(false); // user pressed Enter or selected a dropdown item.
  const [selectedValue, setSelectedValue] = React.useState('');
  const [selectedCollections, setSelectedCollections] = React.useState<SearchMatch[]>([]);
  const timeoutId = React.useRef<any>(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef && inputRef.current && value === 'CLEAR') {
      // when parent component passed in value='CLEAR' (clicked on the Clear button):
      inputRef.current.value = '';
      setOptions([]);
      setSelectedCollections([]);
      inputRef.current.focus();
    }
  }, [value]);

  const clearSearch = () => {
    setSelectedValue('');
    setIsSelecting(true);
    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
      if (onChange) {
        onChange('', '', '');
      }
      setOptions([]);
      inputRef.current.focus();
      onClear();
    }
  };
  const combinedItems = uniqBy([...selectedCollections, ...options], 'address');

  return (
    <div>
      <Downshift
        id="app-search-box"
        onChange={(value) => {
          // user selected a matched from the dropdown
          const val = `${value || ''}`;

          setSelectedValue(val);
          setIsSelecting(true);
          // setOptions([]); // after selecting an option, reset the dropdown options

          if (inputRef && inputRef.current) {
            inputRef.current.value = val;
            if (onChange) {
              const found = options.find((item) => item.value === val);
              onChange(val, found?.address || '', selectedCollections.join(','));
            }
          }
        }}
        itemToString={(item: string[] | null) => `${item}`}
        selectedItem={[selectedValue]}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          openMenu,
          closeMenu,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => {
          const searchByText = async (text: string) => {
            const { collectionNames, nftNames } = (await getTypeAheadOptions({ startsWith: text }, true)) || [];
            // console.log('collectionNames, nftNames', collectionNames, nftNames);
            const arr: any[] = [];
            collectionNames.forEach((item) => {
              // item = {name: 'Posh Pandas', type: 'Collection', hasBlueCheck: true}
              arr.push({
                label: (
                  <Box d="flex" alignItems="flex-start" textAlign="left">
                    <Box my="auto" mx="1" fontSize="lg" fontWeight="medium">
                      {item.name.slice(0, 100)}
                    </Box>
                    {item.hasBlueCheck && (
                      <Box m="1" ml="0">
                        <BlueCheckIcon hasBlueCheck={item.hasBlueCheck} />
                      </Box>
                    )}
                  </Box>
                ),
                value: item.name, // `Collection: ${item.name}`,
                type: 'Collection',
                address: item.address,
                hasBlueCheck: item.hasBlueCheck
              });
            });
            setOptions(arr);
            setSelectedValue(text);
            // setSelectedCollections([]);

            if (onChange) {
              const found = options.find((item) => item.value === text);
              onChange(text, found?.address || '', '');
            }
          };
          const inputProps = { ...getInputProps() };

          return (
            <div className={styles.container}>
              <div className="m-auto w-1/2 mt-6">
                <Input
                  ref={inputRef}
                  placeholder="Collection name"
                  className="w-full"
                  onKeyUp={async (ev) => {
                    if (ev.key === 'Enter') {
                      closeMenu(); // if 'Enter', close menu.
                      return;
                    }
                    const text = (ev.target as HTMLInputElement).value;
                    if (text === selectedValue) {
                      return;
                    }
                    if (text === '') {
                      clearSearch();
                    }
                    if (timeoutId.current) {
                      clearTimeout(timeoutId.current);
                    }
                    timeoutId.current = setTimeout(() => searchByText(text), 200);
                  }}
                  onFocus={() => openMenu()}
                  onKeyDown={inputProps.onKeyDown}
                  onChange={inputProps.onChange}
                  onBlur={inputProps.onBlur}
                />
              </div>
              {inputValue && (
                <button
                  className={styles.clearButton}
                  onClick={() => {
                    clearSearch();
                    closeMenu();
                  }}
                >
                  <CloseIcon height={3} />
                </button>
              )}
            </div>
          );
        }}
      </Downshift>

      <Box mt={2}>
        {combinedItems.map((item, index) => {
          const selectedItem = selectedCollections.find((o) => o.address === item.address);
          return (
            <div key={item.value + index} className={styles.resultRow}>
              <label>
                <Box d="flex" alignItems="center" textAlign="left" className={styles.checkBox}>
                  <input
                    type="checkbox"
                    checked={!!selectedItem}
                    data-address={item.address}
                    onChange={(ev) => {
                      const address = ev.target?.dataset?.address || '';
                      const arr = selectedCollections.filter((item) => item.address !== address);
                      if (ev.target?.checked) {
                        const selectedItem = options.find((item) => item.address === address);
                        if (selectedItem) {
                          arr.push(selectedItem);
                        }
                      }
                      const updatedColls = uniqBy(arr, 'address');
                      setSelectedCollections(updatedColls);
                      if (onChange) {
                        const arr = updatedColls.map((o) => o.address || '');
                        onChange('', arr.length === 1 ? arr[0] : '', arr.join(','));
                      }
                    }}
                  />{' '}
                  <Box ml={1}>{item.value}</Box>
                  {item.hasBlueCheck && (
                    <Box ml={1}>
                      <BlueCheckIcon hasBlueCheck={item.hasBlueCheck} />
                    </Box>
                  )}
                </Box>
              </label>
            </div>
          );
        })}
      </Box>
    </div>
  );
}
