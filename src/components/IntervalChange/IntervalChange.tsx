import { Box } from '@chakra-ui/layout';
import { ChakraProps } from '@chakra-ui/react';
import { IoTriangleSharp } from 'react-icons/io5';
import { numStr } from 'utils/commonUtil';
import styles from './IntervalChange.module.scss';

interface IntervalChangeProps {
  change: number;
  interval: string | number;
  intervalUnits: string;
}

function IntervalChange({ change, interval, intervalUnits, ...rest }: IntervalChangeProps & ChakraProps) {
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" {...rest}>
      <IoTriangleSharp className={`${styles.triangle} ${change > 0 ? styles.green : `${styles.red} ${styles.flip}`}`} />
      <Box display={'flex'} flexDirection={'row'}>
        <p className={`${styles.change} ${change > 0 ? styles.green : styles.red}`}>{numStr(Math.abs(change))}</p>
        <p className={`${styles.unit} ${change > 0 ? styles.green : styles.red}`}>
          {interval}
          {intervalUnits}
        </p>
      </Box>
    </Box>
  );
}

export default IntervalChange;