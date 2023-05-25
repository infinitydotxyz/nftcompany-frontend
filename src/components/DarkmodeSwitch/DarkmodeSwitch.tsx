import React from 'react';
import styles from './DarkmodeSwitch.module.scss';
import { useColorMode } from '@chakra-ui/react';
import { DarkModeIcon, LightModeIcon } from 'components/Icons/Icons';

export const DarkmodeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  // disabled
  return null;

  // return (
  //   <div className={styles.wrapper}>
  //     <div className={styles.darkMode} onClick={() => toggleColorMode()}>
  //       <div className={styles.message}>
  //         {colorMode === 'dark' ? <LightModeIcon boxSize={7} /> : <DarkModeIcon boxSize={7} />}
  //       </div>
  //     </div>
  //   </div>
  // );
};
