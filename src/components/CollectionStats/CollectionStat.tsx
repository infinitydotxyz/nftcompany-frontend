import { Box } from '@chakra-ui/layout';
import { EthToken } from 'components/Icons/Icons';
import styles from './CollectionStat.module.scss';

function CollectionStat(props: { name: string; value: string | number; unit?: 'ETH' }) {
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
      <p className={styles.name}>{props.name}</p>
      <Box display="flex" flexDirection={'row'} alignItems={'center'}>
        {props.unit === 'ETH' && (
          <Box paddingBottom={'4px'}>
            <EthToken />
          </Box>
        )}
        <p className={styles.value}>{props.value}</p>
      </Box>
    </Box>
  );
}

export default CollectionStat;
