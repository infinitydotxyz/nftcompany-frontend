import React from 'react';
import Downshift, { ControllerStateAndHelpers } from 'downshift';
import styles from './SearchBox.module.scss';
import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { getTypeAheadOptions } from 'services/Listings.service';
import { defaultFilterState, useSearchContext } from 'utils/context/SearchContext';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { useRouter } from 'next/router';
import { getSearchFriendlyString } from 'utils/commonUtil';

type SearchMatch = {
  value: string;
  label: string;
  type: 'Asset' | 'Collection';
};

export default function SearchBox() {
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
    setSearchState({ ...searchState, collectionName: '', text: '', selectedOption: undefined });
    setFilterState(defaultFilterState);
    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onChangeSearchBox = (value: string[] | null) => {
    // user selected a matched from the dropdown
    let val = `${value || ''}`;

    if (val.indexOf('Collection:') === 0) {
      val = val.slice(12); // remove "Collection: " in the front.
      router.push(`/collection/${getSearchFriendlyString(val)}`);
    } else {
      setSearchState({
        ...searchState,
        selectedOption: undefined,
        collectionName: '',
        text: val
      });
    }

    setSelectedValue(val);
    setIsSelecting(true);
    setOptions([]); // after selecting an option, reset the dropdown options

    if (inputRef && inputRef.current) {
      inputRef.current.value = val;
    }
  };

  return (
    <div>
      <Downshift
        id="app-search-box"
        onChange={onChangeSearchBox}
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
            // console.log('ev', text, inputValue);
            if (router.route !== '/explore') {
              router.push('/explore');
            }
            const { collectionNames, nftNames } = (await getTypeAheadOptions({ startsWith: text })) || [];
            // console.log('collectionNames, nftNames', collectionNames, nftNames);
            const arr: any[] = [];
            collectionNames.forEach((item) => {
              // item = {name: 'Posh Pandas', type: 'Collection', hasBlueCheck: true}
              arr.push({
                label: (
                  <Box d="flex" alignItems="flex-start" textAlign="left">
                    <Box my="auto" mx="1" fontSize="lg" fontWeight="medium">
                      <Box d="inline" fontWeight="bold">
                        Collection:{' '}
                      </Box>
                      {item.name.slice(0, 100)}
                    </Box>
                    {item.hasBlueCheck && (
                      <Box m="1" ml="0">
                        <BlueCheckIcon hasBlueCheck={item.hasBlueCheck} />
                      </Box>
                    )}
                  </Box>
                ),
                value: `Collection: ${item.name}`,
                type: 'Collection'
              });
            });
            nftNames.forEach((item) => {
              arr.push({
                label: (
                  <Box d="flex" alignItems="flex-start" textAlign="left">
                    <Box my="auto" mx="1" fontSize="lg" fontWeight="medium">
                      <Box d="inline" fontWeight="bold">
                        Asset:{' '}
                      </Box>
                      {` ${item.name.slice(0, 100)}`}
                    </Box>
                    {item.hasBlueCheck && (
                      <Box m="1" ml="0">
                        <BlueCheckIcon hasBlueCheck={item.hasBlueCheck} />
                      </Box>
                    )}
                  </Box>
                ),
                value: item.name,
                type: 'Asset'
              });
            });
            setOptions(arr);
            setSelectedValue(text);

            setSearchState({
              ...searchState,
              selectedOption: undefined,
              collectionName: '',
              text: text.toLowerCase()
            });
          };
          const inputProps = { ...getInputProps() };

          return (
            <div className={styles.container}>
              <div className="m-auto w-1/2">
                <InputGroup>
                  <InputLeftElement pointerEvents="none" size="xs">
                    <SearchIcon className={styles.searchIcon} />
                  </InputLeftElement>
                  <Input
                    ref={inputRef}
                    placeholder="Search"
                    className={styles.searchBox}
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
                    // {...getInputProps({
                    //   onFocus: openMenu
                    // })}
                  />
                </InputGroup>
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
