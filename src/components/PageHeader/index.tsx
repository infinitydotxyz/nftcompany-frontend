import { Spacer } from '@chakra-ui/layout';
import React from 'react';
import styles from './styles.module.scss';

type Props = {
  title: string;
  rightSide?: JSX.Element;
};

export const PageHeader = ({ title, rightSide }: Props): JSX.Element => {
  return (
    <div className={styles.main}>
      <div className={styles.title}>{title}</div>

      {rightSide && (
        <>
          <Spacer />
          <div>{rightSide}</div>
        </>
      )}
    </div>
  );
};
