import { Box, Text } from '@chakra-ui/react';
import { SortArrowsIcon } from 'components/Icons/Icons';
import { OrderDirection } from 'services/Stats.service';

type Props = {
  direction: '' | OrderDirection.Ascending | OrderDirection.Descending;
  marginLeft?: string;
};

export const SortArrows = ({ marginLeft = '8px', direction }: Props): JSX.Element => {
  return (
    <Box marginLeft={marginLeft}>
      <SortArrowsIcon mode={direction} />
    </Box>
  );
};
