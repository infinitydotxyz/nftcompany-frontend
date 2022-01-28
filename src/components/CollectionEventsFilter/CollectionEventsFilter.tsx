import { Box } from '@chakra-ui/layout';
import { ChakraProps, Checkbox, Text } from '@chakra-ui/react';
import { EventType } from 'components/CollectionEvents/CollectionEvents';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useAppContext } from 'utils/context/AppContext';

function CollectionEventsFilter({
  filterState,
  setFilterState,
  ...rest
}: { filterState: EventType; setFilterState: Dispatch<SetStateAction<EventType>> } & ChakraProps) {
  const { headerPosition } = useAppContext();

  return (
    <Box
      display="flex"
      flexDirection={'column'}
      justifyContent={'flex-start'}
      alignItems={'flex-start'}
      position={'sticky'}
      top={`${headerPosition}px`}
      height="min-content"
      width="auto"
      fontSize={'0.95rem'}
      {...rest}
    >
      <Text mb={4} mt={4} textAlign={'center'} width="100%">
        Event Type
      </Text>

      <Box display="flex" flexDirection="column" gridGap={2}>
        <Checkbox isChecked={filterState === EventType.Sale} onChange={() => setFilterState(EventType.Sale)}>
          <Text width="auto" fontSize={'0.95rem'}>
            Sales
          </Text>
        </Checkbox>
        <Checkbox isChecked={filterState === EventType.Transfer} onChange={() => setFilterState(EventType.Transfer)}>
          <Text width="auto" fontSize={'0.95rem'}>
            Transfers
          </Text>
        </Checkbox>
        <Checkbox isChecked={filterState === EventType.Offer} onChange={() => setFilterState(EventType.Offer)}>
          <Text width="auto" fontSize={'0.95rem'}>
            Offers
          </Text>
        </Checkbox>
      </Box>
    </Box>
  );
}

export default CollectionEventsFilter;
