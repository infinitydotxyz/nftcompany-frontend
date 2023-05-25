import { Box } from '@chakra-ui/layout';
import { StylesProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import styles from './IconWithText.module.scss';

interface IconWithTextProps {
  icon: ReactNode;
  text: string;
}

function IconWithText(props: IconWithTextProps) {
  return (
    <Box display="flex" flexDirection={'row'} justifyContent={'flex-start'} alignItems={'flex-start'}>
      <Box display={'flex'} justifyContent={'center'} alignItems="center">
        {props.icon}
      </Box>
      <p className={styles.text}>{props.text}</p>
    </Box>
  );
}

export default IconWithText;
