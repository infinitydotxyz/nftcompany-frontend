import { Box } from '@chakra-ui/layout';
import styles from './CollectionStat.module.scss';

function CollectionStat(props: { name: string; value: string | number }) {
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
      <p className={styles.name}>{props.name}</p>
      <p className={styles.value}>{props.value}</p>
    </Box>
  );
}

export default CollectionStat;
