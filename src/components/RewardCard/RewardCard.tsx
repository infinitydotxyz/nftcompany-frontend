import React from 'react';
import { numStr } from 'utils/commonUtil';
import styles from './RewardCard.module.scss';
import { Countdown } from 'components/Countdown/Countdown';
import { AlarmIcon, LeaderboardIcon, StatsIcon } from 'components/Icons/Icons';
import { LeaderBoard } from 'types/rewardTypes';
import { LeaderBoardTable } from 'components/LeaderBoard/LeaderBoardTable';
import graph from './graph.svg';
import { ClockSvg, GiftSvg } from 'components/Icons/SvgIcons';

export type DataItem = {
  title: string;
  value: any;
};

type IProps = {
  title: string;
  icon?: JSX.Element;
  lines?: boolean;
  items: DataItem[];
};

export const RewardCard = ({ title, icon, lines = true, items }: IProps) => {
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
      <div className={styles.title}>
        {icon && <div className={styles.icon}>{icon} </div>}
        {title}
      </div>
      <div>{divs}</div>
    </div>
  );
};

// ==========================================================

type Props = {
  title: string;
  icon?: JSX.Element;

  expiryTimestamp: Date;
};

export const CountdownCard = ({ icon, expiryTimestamp, title }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        {icon && <div className={styles.icon}>{icon} </div>}
        {title}
      </div>
      <div className={styles.countdown}>
        <div>
          <Countdown expiryTimestamp={expiryTimestamp} />

          <div style={{ marginTop: 4 }}>until next epoch</div>
        </div>
      </div>
    </div>
  );
};

type XProps = {
  data?: LeaderBoard;
};

export const LeaderboardCard = ({ data }: XProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.icon}>
          {/* <LeaderboardIcon boxSize={8} /> */}
          {GiftSvg}
        </div>
        <div>Leaderboard</div>
      </div>
      <div className={styles.countdown}>
        <div>
          <LeaderBoardTable data={data} />
        </div>
      </div>
    </div>
  );
};
