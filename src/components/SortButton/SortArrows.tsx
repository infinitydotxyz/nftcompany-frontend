import { Box, Text } from '@chakra-ui/react';
import { CarrotDown, CarrotUp } from 'components/Icons/Icons';
import { OrderDirection } from 'services/Stats.service';

type Props = {
  direction: '' | OrderDirection.Ascending | OrderDirection.Descending;
  marginLeft?: string;
};

export const SortArrows = ({ marginLeft = '8px', direction }: Props): JSX.Element => {
  const defaultArrows = (
    <>
      <CarrotUp width="10px" position="relative" top="-5px" />
      <CarrotDown width="10px" position="relative" top="-10px" />
    </>
  );

  const topArrow = (
    <>
      <CarrotUp width="10px" position="relative" top="-5px" />
      <CarrotDown width="10px" position="relative" top="-10px" color="#bbb" />
    </>
  );

  const bottomArrow = (
    <>
      <CarrotUp width="10px" position="relative" top="-5px" color="#bbb" />
      <CarrotDown width="10px" position="relative" top="-10px" />
    </>
  );

  const getArrows = () => {
    switch (direction) {
      case OrderDirection.Ascending:
        return topArrow;
      case OrderDirection.Descending:
        return bottomArrow;
      default:
        return defaultArrows;
    }
  };

  return (
    <Box marginLeft={marginLeft} display={'flex'} flexDirection={'column'} height={15}>
      {getArrows()}
    </Box>
  );
};
