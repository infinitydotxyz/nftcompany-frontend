import { Box, Text } from '@chakra-ui/react';
import { OrderDirection } from 'services/Stats.service';
import { SortArrows } from './SortArrows';

type Props = {
  direction: '' | OrderDirection.Ascending | OrderDirection.Descending;
  onClick: () => void;
  label?: string;
};

export const SortButton = ({ onClick, label, direction }: Props): JSX.Element => {
  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      cursor={'pointer'}
      position="relative"
      onClick={onClick}
      alignItems={'center'}
    >
      {label && <Text>{label}</Text>}

      <SortArrows direction={direction} />
    </Box>
  );
};
