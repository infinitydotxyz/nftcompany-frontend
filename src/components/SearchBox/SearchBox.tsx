import React from 'react';
import Downshift from 'downshift';
import styles from './SearchBox.module.scss';
import { getTypeAheadOptions } from 'services/Listings.service';
import { defaultFilterState, useSearchContext } from 'utils/context/SearchContext';
import { CloseIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const data: any = [
  // { value: 'name', label: 'name' }
];

export default function SearchBox() {
  const router = useRouter();
  const [options, setOptions] = React.useState<any[]>([]);
  const [selectedValue, setSelectedValue] = React.useState('');
  const { searchState, setSearchState, setFilterState } = useSearchContext();
  const timeoutId = React.useRef<any>(0);

  React.useEffect(() => {
    setOptions(data);
  }, []);

  const clearSearch = () => {
    setSelectedValue('');
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
          // setFilterState(defaultFilterState);
          // if (router.route !== '/explore') {
          //   router.push('/explore');
          // }

          // const foundItem = options.find((item) => item.value === value);
          setSelectedValue(val);
          setOptions([]); // after selecting an option, reset the dropdown options
        }}
        itemToString={(item: string[] | null) => `${item}`}
        selectedItem={[selectedValue]}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          openMenu,
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
                  <div>
                    <strong>Collection:</strong>
                    {` ${item.name}`}
                  </div>
                ),
                value: `Collection: ${item.name}`,
                type: 'Collection'
              });
            });
            nftNames.forEach((item: any) => {
              // item = {name: 'Posh Pandas', type: 'Collection', hasBlueCheck: true}
              arr.push({
                label: (
                  <div>
                    <strong>Asset:</strong>
                    {` ${item.name} #${item.id.length > 4 ? item.id.slice(-4) : item.id}`}
                  </div>
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

          return (
            <div className={styles.container}>
              <div className="m-auto w-1/2 mt-6">
                <input
                  placeholder="Search..."
                  className="w-full"
                  value={`${inputValue}`}
                  onKeyUp={async (ev: any) => {
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
                  {...getInputProps({ onFocus: openMenu })}
                />
                <ul className={styles.dropPanel} {...getMenuProps()}>
                  {isOpen
                    ? options.map((item: any, index) => (
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
                      ))
                    : null}
                </ul>
              </div>
              <button onClick={() => clearSearch()}>
                <CloseIcon color="#aaa" ml={-10} height={3} />
              </button>
            </div>
          );
        }}
      </Downshift>
    </div>
  );
}
