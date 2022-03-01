import React, { Fragment, useRef, KeyboardEvent, useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { getTypeAheadOptions, TypeAheadOption } from 'services/Listings.service';
import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import { BlueCheckIcon } from 'components/Icons/BlueCheckIcon';
import styles from './styles.module.scss';

type Props = {
  onSelect: (collectionAddress: string) => void;
};

export const CollectionSearch = ({ onSelect }: Props): JSX.Element => {
  const typeaheadRef = useRef<any>();
  const [collectionNames, setCollectionNames] = useState<TypeAheadOption[]>([]);

  const handleSearch = async (query: string) => {
    const results = await getTypeAheadOptions({ startsWith: query });

    setCollectionNames(results.collectionNames);
  };

  // on clicking on a dropdown match:
  const handleChange = (selectedOptions: TypeAheadOption[]) => {
    if (selectedOptions.length > 0) {
      const collectionAddress = selectedOptions[0].address;

      if (collectionAddress) {
        onSelect(collectionAddress);
      }
    }
  };

  const clearSearch = () => {
    typeaheadRef.current.clear();
    setCollectionNames([]);
  };

  const handleClickCloseIcon = () => {
    clearSearch();
  };

  return (
    <Box display="flex">
      <Box className={styles.typeahead} flex="1">
        <AsyncTypeahead
          id="watchlist-typeahead"
          onChange={handleChange}
          ref={typeaheadRef}
          minLength={1}
          filterBy={() => true}
          labelKey={(option) => option.name}
          isLoading={false} // SNG
          onSearch={handleSearch}
          options={collectionNames}
          placeholder="Search"
          renderMenuItemChildren={(option) => (
            <Fragment>
              <Box d="flex" alignItems="flex-start" textAlign="center">
                <Box my="auto" mx="1" fontSize="lg" fontWeight="medium">
                  <Box d="inline" fontWeight="bold">
                    {option.type}:{' '}
                  </Box>
                  {option.name}
                </Box>
                {option.hasBlueCheck && (
                  <Box m="1" ml="0">
                    <BlueCheckIcon hasBlueCheck={option.hasBlueCheck} />
                  </Box>
                )}
              </Box>
            </Fragment>
          )}
        ></AsyncTypeahead>
      </Box>

      <CloseIcon color="gray.400" m="auto" mx="3" cursor="pointer" onClick={handleClickCloseIcon} />
    </Box>
  );
};
