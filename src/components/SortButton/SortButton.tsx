import { Box, Text } from '@chakra-ui/react';
import { CarrotDown, CarrotUp } from 'components/Icons/Icons';
import { OrderDirection } from 'services/Stats.service';

function SortButton(props: {
  state: '' | OrderDirection.Ascending | OrderDirection.Descending;
  onClick: () => void;
  label?: string;
}) {
  const defaultArrows = (
    <>
      <CarrotUp width="10px" />
      <CarrotDown width="10px" />
    </>
  );

  const topArrow = <CarrotUp width="10px" />;
  const bottomArrow = <CarrotDown width="10px" />;

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
    <Box
      display={'flex'}
      flexDirection={'row'}
      cursor={'pointer'}
      position="relative"
      onClick={props.onClick}
      alignItems={'center'}
    >
      {props.label && <Text>{props.label}</Text>}

      <Box display={'flex'} flexDirection={'column'} position="relative" marginLeft="8px">
        {getArrows()}
      </Box>
    </Box>
  );
}

export default SortButton;
