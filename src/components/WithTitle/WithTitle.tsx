import React, { Children } from 'react';
import { Box } from '@chakra-ui/layout';
import styles from './WithTitle.module.scss';
import { ChakraProps } from '@chakra-ui/react';

interface Props {
  title: string;
  children: React.ReactNode | React.ReactNode[];
}

function WithTitle({ children, title, ...rest }: Props & ChakraProps) {
  return (
    <Box {...rest}>
      <p className={styles.title}>{title}</p>
      <Box marginTop="16px">{children}</Box>
    </Box>
  );
}
export default WithTitle;
