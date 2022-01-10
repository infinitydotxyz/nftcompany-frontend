import { Box, SimpleGrid } from '@chakra-ui/react';
import HorizontalLine from 'components/HorizontalLine/HorizontalLine';
import { ReactNode } from 'react';
import styles from './InfoGroup.module.scss';

interface InfoGroupProps {
  title: string;

  space: 'evenly' | 'start';
  children: ReactNode;
  minChildWidth: string;
  maxChildWidth?: string;
  spacing?: string;
}

function InfoGroup(props: InfoGroupProps) {
  return (
    <Box display="flex" flexDirection={'column'} justifyContent={'space-between'}>
      <p className={styles.title}>{props.title}</p>

      {props.space === 'evenly' ? (
        <Box
          display="flex"
          flexDirection={'row'}
          alignItems="space-between"
          width="100%"
          justifyContent={'space-between'}
          marginBottom={'32px'}
        >
          {props.children}
        </Box>
      ) : (
        <SimpleGrid
          spacing={props.spacing ? props.spacing : '10px'}
          marginBottom={'32px'}
          templateColumns={`repeat(auto-fit, minmax(${props.minChildWidth}, ${props.maxChildWidth ?? '1fr'}));`}
        >
          {props.children}
        </SimpleGrid>
      )}
      <HorizontalLine />
    </Box>
  );
}

export default InfoGroup;
