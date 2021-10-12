import React from 'react';
import Downshift from 'downshift';
import styles from './SearchBox.module.scss';
import { Box } from '@chakra-ui/react';
import { getTypeAheadOptions } from 'services/Listings.service';
import { defaultFilterState, useSearchContext } from 'utils/context/SearchContext';
import { CloseIcon } from '@chakra-ui/icons';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import { useRouter } from 'next/router';

const data: any = [
  // { value: 'name', label: 'name' }
];

export default function SearchBox() {
  const router = useRouter();
  const [options, setOptions] = React.useState<any[]>([]);
  const [isSelecting, setIsSelecting] = React.useState(false); // user pressed Enter or selected a dropdown item.
  const [selectedValue, setSelectedValue] = React.useState('');
  const { searchState, setSearchState, setFilterState } = useSearchContext();
  const timeoutId = React.useRef<any>(0);

  React.useEffect(() => {
    setOptions(data);
  }, []);

  const clearSearch = () => {
    setSelectedValue('');
    setIsSelecting(true);
    setSearchState({ ...searchState, collectionName: '', text: '', selectedOption: undefined });
    setFilterState(defaultFilterState);
  };

  return (
    <div>
      <Downshift
        onChange={(value: any, b: any) => {
          // user selected a matched from the dropdown

          // console.log('value', value, typeof value, b);
          let val = value;

          if (value.indexOf('Collection:') === 0) {
            val = val.slice(12); // remove "Collection: " in the front.
            setSearchState({
              ...searchState,
              selectedOption: undefined,
              collectionName: val,
              text: ''
            });
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
            // console.log('ev', text, inputValue);
            if (router.route !== '/explore') {
              router.push('/explore');
            }
            const { collectionNames, nftNames } = (await getTypeAheadOptions({ startsWith: text })) || [];
            // console.log('collectionNames, nftNames', collectionNames, nftNames);
            const arr: any[] = [];
            collectionNames.forEach((item: any) => {
              // item = {name: 'Posh Pandas', type: 'Collection', hasBlueCheck: true}
              arr.push({
                label: (
                  <Box d="flex" alignItems="flex-start" textAlign="center">
                    <Box my="auto" mx="1" fontSize="lg" fontWeight="medium">
                      <Box d="inline" fontWeight="bold">
                        Collection:{' '}
                      </Box>
                      {item.name}
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
            nftNames.forEach((item: any) => {
              arr.push({
                label: (
                  <Box d="flex" alignItems="flex-start" textAlign="center">
                    <Box my="auto" mx="1" fontSize="lg" fontWeight="medium">
                      <Box d="inline" fontWeight="bold">
                        Asset:{' '}
                      </Box>
                      {` ${item.name}`}
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

            const matches: any[] = arr.filter((item: any) => item.value.toLowerCase().indexOf(text.toLowerCase()) >= 0);
            // console.log('matches', matches);
            setOptions(matches);
            setSelectedValue(text);

            setSearchState({
              ...searchState,
              selectedOption: undefined,
              collectionName: '',
              text: text.toLowerCase()
            });
          };
          const inputProps = { ...getInputProps() };

          const moreProps: any = {};
          if (isSelecting) {
            moreProps.value = selectedValue; // only set value to the Input when user Enter or Select an item. (to avoid flickering)
            setIsSelecting(false);
          }
          return (
            <div className={styles.container}>
              <div className="m-auto w-1/2 mt-6">
                <input
                  placeholder="Search..."
                  className="w-full"
                  {...moreProps}
                  onKeyUp={async (ev: any) => {
                    if (ev.keyCode === 13) {
                      closeMenu(); // if 'Enter', close menu.
                    }
                    const text = ev.target.value;
                    if (text === selectedValue) {
                      return;
                    }
                    if (text === '') {
                      clearSearch();
                    }
                    // setText(val);
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
                {isOpen ? (
                  <ul
                    className={styles.dropPanel + ' ' + (options.length > 0 && styles.dropPanelOpened)}
                    {...getMenuProps()}
                  >
                    {options.map((item: any, index) => (
                      <li
                        key={item.value + index}
                        {...getItemProps({
                          key: item.value + index,
                          index,
                          item: item.value,
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
