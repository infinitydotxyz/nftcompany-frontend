import React from 'react';
import Downshift from 'downshift';
import { Box, Input } from '@chakra-ui/react';
import { getTypeAheadOptions } from 'services/Listings.service';
import { defaultFilterState, useSearchContext } from 'utils/context/SearchContext';
import { CloseIcon } from '@chakra-ui/icons';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { useRouter } from 'next/router';

import styles from './CollectionNameFilter.module.scss';

type SearchMatch = {
  value: string;
  label: string;
  type: 'Asset' | 'Collection';
};

type CollectionNameFilterProps = {
  onChange: (value: string) => void;
};

export default function CollectionNameFilter({ onChange }: CollectionNameFilterProps) {
  const router = useRouter();
  const [options, setOptions] = React.useState<SearchMatch[]>([]);
  const [isSelecting, setIsSelecting] = React.useState(false); // user pressed Enter or selected a dropdown item.
  const [selectedValue, setSelectedValue] = React.useState('');
  const { searchState, setSearchState, setFilterState } = useSearchContext();
  const timeoutId = React.useRef<any>(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const clearSearch = () => {
    setSelectedValue('');
    setIsSelecting(true);
    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
      if (onChange) {
        onChange('');
      }
    }
  };

  return (
    <div>
      <Downshift
        id="app-search-box"
        onChange={(value) => {
          // user selected a matched from the dropdown
          let val = `${value || ''}`;

          setSelectedValue(val);
          setIsSelecting(true);
          setOptions([]); // after selecting an option, reset the dropdown options

          if (inputRef && inputRef.current) {
            inputRef.current.value = val;
            if (onChange) {
              onChange(val);
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
                type: 'Collection'
              });
            });
            setOptions(arr);
            setSelectedValue(text);
            if (onChange) {
              onChange(text);
            }
          };
          const inputProps = { ...getInputProps() };

          return (
            <div className={styles.container}>
              <div className="m-auto w-1/2 mt-6">
                <Input
                  ref={inputRef}
                  placeholder="Search by name..."
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
                {isOpen ? (
                  <ul
                    className={styles.dropPanel + ' ' + (options.length > 0 && styles.dropPanelOpened)}
                    {...getMenuProps()}
                  >
                    {options.map((item, index) => (
                      <li
                        key={item.value + index}
                        {...getItemProps({
                          key: item.value + index,
                          index,
                          item: [item.value],
                          className: `py-2 px-2 ${highlightedIndex === index ? styles.bold : 'bg-gray-100'}`
                        })}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                ) : null}
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
    </div>
  );
}
