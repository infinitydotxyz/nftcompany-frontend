import { ChakraProps, Box } from '@chakra-ui/react';
import React from 'react';
import styles from './TextToggle.module.scss';

interface TextToggleProps {
  checkedText: string;
  unCheckedText: string;
  checked: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function TextToggle({ checkedText, unCheckedText, checked, onClick, ...rest }: TextToggleProps & ChakraProps) {
  return (
    <Box className={styles.wrapper} onClick={onClick} {...rest}>
      <div className={`${styles.option} ${styles.slide} ${!checked ? styles.selected : ''}`}>{unCheckedText}</div>

      <div className={`${styles.option} ${checked ? styles.selected : ''}`}>{checkedText}</div>
    </Box>
  );
}

export default TextToggle;
