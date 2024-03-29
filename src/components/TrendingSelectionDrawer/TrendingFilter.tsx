import { Box, Checkbox, Stack, Text, Button, Tooltip, Spacer } from '@chakra-ui/react';
import { DataColumns } from 'components/TrendingList/DataColumns';
import { SecondaryOrderBy } from 'hooks/useTrendingStats';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
  dataColumns: DataColumns;
  setDataColumns: Dispatch<SetStateAction<DataColumns>>;
  onClose: () => void;
};

export const TrendingFilter = ({ dataColumns, setDataColumns, onClose }: Props): JSX.Element => {
  const [tempDataColumns, setTempDataColumns] = useState<DataColumns>(dataColumns);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setTempDataColumns(dataColumns);
  }, [dataColumns]);

  const isDataColumnsValid = () => {
    let numSelected = 0;
    for (const col of Object.values(tempDataColumns)) {
      numSelected += col.isSelected ? 1 : 0;
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
    <Box flex={1} display="flex" flexDirection="column" style={{ height: '100%' }}>
      <Stack spacing={2} direction="column">
        {Object.entries(tempDataColumns).map(([itemKey, item]) => {
          return (
            <Checkbox
              key={itemKey}
              isChecked={item.isSelected}
              disabled={item.isDisabled}
              onChange={() => {
                setTempDataColumns((prev) => {
                  return {
                    ...prev,
                    [itemKey]: {
                      ...prev[itemKey as SecondaryOrderBy],
                      isSelected: !prev[itemKey as SecondaryOrderBy].isSelected
                    }
                  };
                });
              }}
            >
              {item.name}
            </Checkbox>
          );
        })}
      </Stack>
      <Spacer />
      <Box mb={4} display="flex" flexDirection="row" justifyContent="center">
        <Tooltip label={errorMessage} placement="bottom" hasArrow>
          <Box>
            <Button
              marginRight={'20px'}
              onClick={() => {
                // must make a copy so the change will be detected
                const copy = { ...tempDataColumns };

                for (const col of Object.values(copy)) {
                  col.isSelected = false;
                }

                setTempDataColumns(copy);
              }}
              borderRadius={100}
              variant="outline"
            >
              Clear All
            </Button>
            <Button
              borderRadius={100}
              onClick={() => {
                setDataColumns(tempDataColumns);

                onClose();
              }}
              isDisabled={!!errorMessage}
            >
              Apply
            </Button>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
