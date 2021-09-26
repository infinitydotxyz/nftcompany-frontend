import React from 'react';
import { numStr } from 'utils/commonUtil';
import styles from './InfoCard.module.scss';

export type DataItem = {
  title: string;
  value: any;
};

type IProps = {
  title: string;
  items: DataItem[];
};

export const InfoCard = ({ title, items }: IProps) => {
  if (!items) {
    return <div>Nothing found</div>;
  }

  const divs = items.map((i) => {
    const val = numStr(i.value);

    return (
      <div key={i.title + i.value} className={styles.infoRow}>
        <div className={styles.left}>{i.title}</div>
        <div className={styles.right}>{val}</div>
      </div>
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <div className={styles.title}>{title}</div>
        <div>{divs}</div>
      </div>
    </div>
  );
};
