import React from 'react';
import styles from './Countdown.module.scss';
import { useTimer } from 'react-timer-hook';

type Props = {
  expiryTimestamp: Date;
};

export const Countdown = ({ expiryTimestamp }: Props) => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => console.log('onExpire called')
  });

  const zero = (num: number): string => {
    let result = num.toString();

    if (num < 10) {
      result = `0${result}`;
    }

    return result;
  };

  return (
    <div className={styles.main}>
      <div className={styles.digit}>
        <div>{days}</div>
        <div className={styles.unit}>d</div>
      </div>

      <div className={styles.digit}>
        <div>{hours}</div>
        <div className={styles.unit}>h</div>
      </div>

      <div className={styles.digit}>
        <div>{zero(minutes)}</div>
        <div className={styles.unit}>m</div>
      </div>

      <div className={styles.digit}>
        <div>{zero(seconds)}</div>
        <div className={styles.unit}>s</div>
      </div>
    </div>
  );
};
