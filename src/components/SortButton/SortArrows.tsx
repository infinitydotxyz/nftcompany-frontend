import { Box, Text } from '@chakra-ui/react';
import { CarrotDown, CarrotUp } from 'components/Icons/Icons';
import { OrderDirection } from 'services/Stats.service';

function SortArrows(props: { state: '' | OrderDirection.Ascending | OrderDirection.Descending }) {
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
    switch (props.state) {
      case OrderDirection.Ascending:
        return topArrow;
      case OrderDirection.Descending:
        return bottomArrow;
      default:
        return defaultArrows;
    }
  };

  return (
    <Box display={'flex'} flexDirection={'column'} height={15}>
      {getArrows()}
    </Box>
  );
}

export default SortArrows;
