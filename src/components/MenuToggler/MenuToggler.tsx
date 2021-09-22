import React from 'react';
import styles from './MenuToggler.module.scss';

type Props = {
  isActive: boolean;
  [key: string]: any;
};

function MenuToggler({ isActive, ...props }: Props) {
  const buttonClasses = [styles.hamburger];

  if (isActive) {
    buttonClasses.push(styles.hamburgerSpin);
    buttonClasses.push(styles.isActive);
  }

  return (
    <button className={buttonClasses.join(' ')} type="button" {...props}>
      <span className={styles.hamburgerBox}>
        <span className={styles.hamburgerInner}></span>
      </span>
    </button>
  );
}

export default MenuToggler;
