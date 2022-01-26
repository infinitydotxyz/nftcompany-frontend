import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Checkbox, Stack, Text, Button, Tooltip } from '@chakra-ui/react';
import ModalDialog from 'components/ModalDialog/ModalDialog';
import { SecondaryOrderBy } from 'hooks/useTrendingStats';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DataColumnGroup, DataColumns } from '../../unfinished/trending';

interface Props {
  dataColumns: DataColumns;
  setDataColumns: Dispatch<SetStateAction<DataColumns>>;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

function DiscoverSelectionModal(props: Props) {
  const [tempDataColumns, setTempDataColumns] = useState<DataColumns>(props.dataColumns);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setTempDataColumns(props.dataColumns);
  }, [props.dataColumns]);

  const isDataColumnsValid = () => {
    let numSelected = 0;
    for (const group of Object.values(tempDataColumns)) {
      for (const col of Object.values(group)) {
        numSelected += col.isSelected ? 1 : 0;
      }
    }

    if (numSelected > 5) {
      return 'A max of 5 categories can be selected';
    }

    return '';
  };

  useEffect(() => {
    setErrorMessage(isDataColumnsValid());
  }, [tempDataColumns]);

  return (
    <ModalDialog onClose={props.onClose}>
      <Box display="flex" flexDirection={'column'}>
        <Text size="2xl" variant="bold" paddingBottom={'8px'}>
          Categories
        </Text>
        <Text size="lg" fontWeight={400}>
          Select up to <b>5</b> categories to be displayed
        </Text>
      </Box>
      <Box paddingY="42.5px">
        <Stack spacing={2} direction="column">
          {Object.entries(tempDataColumns).map(([groupKey, group]) => {
            return (
              <>
                {Object.entries(group).map(([itemKey, item]) => {
                  return (
                    <Checkbox
                      key={itemKey}
                      isChecked={item.isSelected}
                      disabled={item.isDisabled}
                      onChange={() => {
                        setTempDataColumns((prev) => {
                          return {
                            ...prev,
                            [groupKey]: {
                              ...prev[groupKey as DataColumnGroup],
                              [itemKey]: {
                                ...prev[groupKey as DataColumnGroup][itemKey as SecondaryOrderBy],
                                isSelected: !prev[groupKey as DataColumnGroup][itemKey as SecondaryOrderBy].isSelected
                              }
                            }
                          };
                        });
                      }}
                    >
                      {item.name}
                    </Checkbox>
                  );
                })}
              </>
            );
          })}
        </Stack>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="flex-start">
        <Tooltip label={errorMessage} placement="bottom" hasArrow>
          <Box>
            <Button
              marginRight={'8px'}
              onClick={() => {
                props.setDataColumns(tempDataColumns);
              }}
              isDisabled={!!errorMessage}
            >
              Apply
            </Button>
          </Box>
        </Tooltip>
        <Button marginLeft={'8px'} variant={'outline'} onClick={props.onClose}>
          Cancel
        </Button>
      </Box>
    </ModalDialog>
  );
}

export default DiscoverSelectionModal;
