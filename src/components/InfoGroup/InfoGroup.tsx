import { Box, SimpleGrid } from '@chakra-ui/react';
import HorizontalLine from 'components/HorizontalLine/HorizontalLine';
import { ReactNode } from 'react';
import styles from './InfoGroup.module.scss';

interface InfoGroupProps {
  title: string;

  //   infoChildren: ReactNode[];
  children: ReactNode[];

  minChildWidth: string;
}

function InfoGroup(props: InfoGroupProps) {
  return (
    <Box display="flex" flexDirection={'column'} justifyContent={'space-between'}>
      <p className={styles.title}>{props.title}</p>
      <SimpleGrid minChildWidth={props.minChildWidth} spacing="10px" marginBottom={'32px'}>
        {props.children}
      </SimpleGrid>
      <HorizontalLine />
    </Box>
  );
}

export default InfoGroup;
