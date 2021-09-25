import React from 'react';
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

  const shrnk = (value: any): string => {
    let short;

    if (typeof value === 'string') {
      if (value.includes('.')) {
        const f = parseFloat(value);
        if (f) {
          short = f.toFixed(4);
        }
      }

      short = value;
    } else if (typeof value === 'number') {
      short = value.toFixed(4);
    } else {
      short = value.toString();
    }

    let zeros = '.0000';
    if (short.endsWith(zeros)) {
      short = short.substring(0, short.length - zeros.length);
    }

    zeros = '00';
    if (short.endsWith(zeros)) {
      short = short.substring(0, short.length - zeros.length);
    }

    const p = parseFloat(short);
    if (!isNaN(p)) {
      // this adds commas
      return p.toLocaleString();
    }

    return short;
  };

  const divs = items.map((i) => {
    const val = shrnk(i.value);

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
