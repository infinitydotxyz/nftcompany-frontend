import React from 'react';
import { numStr } from 'utils/commonUtil';
import styles from './RewardCard.module.scss';
import { Countdown } from 'components/Countdown/Countdown';

export type DataItem = {
  title: string;
  value: any;
};

type IProps = {
  title: string;
  lines?: boolean;
  items: DataItem[];
};

export const RewardCard = ({ title, lines = true, items }: IProps) => {
  if (!items) {
    return <div>Nothing found</div>;
  }

  const classes = [styles.infoRow];

  if (lines) {
    classes.push(styles.topBorder);
  }

  const divs = items.map((i) => {
    const val = numStr(i.value);

    return (
      <div key={i.title + i.value} className={classes.join(' ')}>
        <div className={styles.left}>{i.title}</div>
        <div className={styles.right}>{val}</div>
      </div>
    );
  });

  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div>{divs}</div>
    </div>
  );
};

// ==========================================================

type Props = {
  title: string;
  expiryTimestamp: Date;
};

export const CountdownCard = ({ expiryTimestamp, title }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.countdown}>
        <div>
          <Countdown expiryTimestamp={expiryTimestamp} />

          <div style={{ marginTop: 4 }}>until next epoch</div>
        </div>
      </div>
    </div>
  );
};
