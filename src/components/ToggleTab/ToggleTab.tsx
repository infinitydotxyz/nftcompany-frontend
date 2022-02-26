import { ChakraProps, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import styles from './ToggleTab.module.scss';

interface ToggleTab {
  selected: string;
  options: string[];
  onChange: (option: string) => void;
  size?: 'sm';
}

export function useToggleTab(options: string[], defaultOption: string) {
  const [selected, setSelected] = useState(defaultOption);

  const onChange = (option: string) => {
    setSelected(option);
  };

  return { onChange, selected, options };
}

function ToggleTab({ options, onChange, selected, size, ...rest }: ToggleTab & ChakraProps) {
  return (
    <Box className={styles.wrapper} {...rest}>
      {options.map((option: string) => {
        let optionName = option;
        if (optionName === 'Total') {
          optionName = 'All time';
        }

        return (
          <div
            key={option}
            className={`${styles.option} ${size === 'sm' ? styles.sm : ''} ${
              selected === option ? styles.selected : ''
            }`}
            onClick={() => onChange(option)}
          >
            {optionName}
          </div>
        );
      })}
    </Box>
  );
}

export default ToggleTab;
