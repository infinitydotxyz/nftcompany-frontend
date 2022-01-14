import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Heading,
  IconButton,
  Stack,
  useMediaQuery,
  Text
} from '@chakra-ui/react';
import { SecondaryOrderBy } from 'hooks/useTrendingStats';
import { useAppContext } from 'utils/context/AppContext';
import { DataColumnGroup, DataColumns } from '../../../pages/trending';

interface Props {
  dataColumns: DataColumns;
  toggleDataColumn: (group: DataColumnGroup, column: SecondaryOrderBy) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

function TrendingFilterDrawer(props: Props) {
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const { headerPosition } = useAppContext();

  return (
    <>
      <IconButton
        aria-label=""
        variant="ghost"
        size="md"
        maxWidth="48px"
        colorScheme="gray"
        onClick={() => {
          if (props.isOpen) {
            props.onClose();
          } else {
            props.onOpen();
          }
        }}
      >
        {props.isOpen ? <ArrowBackIcon /> : <ArrowForwardIcon />}
      </IconButton>

      <Drawer
        isOpen={props.isOpen}
        placement="left"
        onClose={() => undefined}
        size={isMobile ? 'full' : 'xs'}
        blockScrollOnMount={false}
        trapFocus={false}
      >
        <DrawerContent shadow="lg" mt={headerPosition + 12}>
          <DrawerHeader display="flex" justifyContent="space-between" alignItems="center">
            <Heading size="sm">Columns</Heading>
            <IconButton
              aria-label=""
              variant="ghost"
              size="md"
              maxWidth="48px"
              colorScheme="gray"
              onClick={props.onClose}
            >
              <ArrowBackIcon />
            </IconButton>
          </DrawerHeader>

          <DrawerBody>
            {Object.entries(props.dataColumns).map(([groupKey, group]) => {
              return (
                <Box key={groupKey} marginBottom={4}>
                  <Text variant="bold" marginBottom={1}>
                    {groupKey}
                  </Text>
                  <Stack spacing={1} direction="column">
                    {Object.entries(group).map(([itemKey, item]) => {
                      return (
                        <Checkbox
                          key={itemKey}
                          isChecked={item.isSelected}
                          disabled={item.isDisabled}
                          onChange={() => {
                            props.toggleDataColumn(groupKey as DataColumnGroup, itemKey as SecondaryOrderBy);
                          }}
                        >
                          {item.name}
                        </Checkbox>
                      );
                    })}
                  </Stack>
                </Box>
              );
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default TrendingFilterDrawer;
