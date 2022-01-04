import React, { MouseEventHandler, useState } from 'react';
import styles from './TextToggle.module.scss';

interface TextToggleProps {
  checkedText: string;
  unCheckedText: string;
  checked: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function TextToggle(props: TextToggleProps) {
  const toggleSwitch = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    props.onClick(event);
  };

  return (
    <div className={styles.wrapper} onClick={(event) => props.onClick(event)}>
      <div className={`${styles.option} ${styles.slide} ${!props.checked ? styles.selected : ''}`}>
        {props.unCheckedText}
      </div>

      <div className={`${styles.option} ${props.checked ? styles.selected : ''}`}>{props.checkedText}</div>
    </div>
  );
}

export default TextToggle;
