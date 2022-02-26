import { Box, Text } from '@chakra-ui/react';
import { OrderDirection } from 'services/Stats.service';
import SortArrows from './SortArrows';

function SortButton(props: {
  state: '' | OrderDirection.Ascending | OrderDirection.Descending;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      cursor={'pointer'}
      position="relative"
      onClick={props.onClick}
      alignItems={'center'}
    >
      {props.label && <Text>{props.label}</Text>}

      <Box marginLeft="8px">
        <SortArrows state={props.state} />
      </Box>
    </Box>
  );
}

export default SortButton;
