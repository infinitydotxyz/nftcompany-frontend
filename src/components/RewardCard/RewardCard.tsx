import React from 'react';
import styles from './RewardCard.module.scss';
import { Countdown } from 'components/Countdown/Countdown';
import { AlarmIcon, AwardIcon, LeaderboardIcon, StatsIcon } from 'components/Icons/Icons';
import { LeaderBoard, UserReward } from '@infinityxyz/lib/types/core';
import { SaleLeaderBoardTable, BuyLeaderBoardTable } from 'components/LeaderBoard/LeaderBoardTable';
import { Progress } from '@chakra-ui/react';
import { values } from 'lodash';

export type DataItem = {
  title: string;
  subtitle?: string;
  value: any;
};

type IProps = {
  title: string;
  icon?: JSX.Element;
  lines?: boolean;
  items: DataItem[];
};

// makes number strings from strings or numbers
export const numberStr = (value: any): string => {
  let short;

  if (typeof value === 'undefined' || value === null) {
    short = '';
  } else if (typeof value === 'string') {
    short = value;
  } else if (typeof value === 'number') {
    short = value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  } else {
    short = value.toString();
  }

  // remove .0000
  let zeros = '.0000';
  if (short.endsWith(zeros)) {
    short = short.substring(0, short.length - zeros.length);
  }

  // .9800 -> .98
  if (short.includes('.')) {
    zeros = '00';
    if (short.endsWith(zeros)) {
      short = short.substring(0, short.length - zeros.length);
    }
  }

  return short;
};

export const RewardCard = ({ title, icon, lines = true, items }: IProps) => {
  if (!items) {
    return <div>Nothing found</div>;
  }

  const classes = [styles.infoRow];
  let fat = false;

  if (lines) {
    classes.push(styles.topBorder);
  } else {
    fat = true;
  }

  const divs = items.map((i) => {
    const val = numberStr(i.value);

    return (
      <div key={i.title + i.value} className={classes.join(' ')}>
        <div className={styles.left}>{i.title}</div>
        <div className={styles.right}>{val}</div>

        {i.subtitle && <div className={styles.subtitle}>{i.subtitle}</div>}
      </div>
    );
  });

  let contentClass = '';
  if (fat) {
    contentClass = styles.fatCard;
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>
        {icon && <div className={styles.icon}>{icon} </div>}
        {title}
      </div>
      <div className={contentClass}>{divs}</div>
    </div>
  );
};

// ==========================================================
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
        <div className={styles.fatCard}>
          <Countdown expiryTimestamp={expiryTimestamp} />

          <div className={styles.message}>Until rewards end</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// ==========================================================

type XProps = {
  data?: LeaderBoard;
};

export const SaleLeaderboardCard = ({ data }: XProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <LeaderboardIcon boxSize={8} />
        </div>
        <div>Top Sellers</div>
      </div>
      <div className={styles.countdown}>
        <div>
          <SaleLeaderBoardTable data={data} />
        </div>
      </div>
    </div>
  );
};

export const BuyLeaderboardCard = ({ data }: XProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <LeaderboardIcon boxSize={8} />
        </div>
        <div>Top Buyers</div>
      </div>
      <div className={styles.countdown}>
        <div>
          <BuyLeaderBoardTable data={data} />
        </div>
      </div>
    </div>
  );
};

// ==========================================================
// ==========================================================

type AProps = {
  reward: UserReward;
};

export const AirdropCard = ({ reward }: AProps) => {
  const classes = [styles.infoRow];
  classes.push(styles.topBorder);

  const items: DataItem[] = [];
  let activity = 0;
  let percentage = '';

  const hasAirdrop = reward.hasAirdrop;
  if (hasAirdrop) {
    const eligible = reward.rewardTier.eligible;
    const ratio = reward.doneSoFar / reward.rewardTier.threshold;

    activity = ratio * 100;
    percentage = activity.toFixed(2);

    items.push({ title: 'Eligible tokens', value: eligible });
    items.push({
      title: 'Transacted',
      value: +reward.doneSoFar.toFixed(3) + ' / ' + reward.rewardTier.threshold + ' ETH'
    });
  } else {
    items.push({ title: 'Not eligible for Airdrop', value: '' });
  }

  const contentEl = items.map((i) => {
    const val = i.value;

    return (
      <div key={i.title + i.value} className={classes.join(' ')}>
        <div className={styles.left}>{i.title}</div>
        <div className={styles.right}>{val}</div>
      </div>
    );
  });

  if (hasAirdrop) {
    contentEl.push(
      <div key="progressBar">
        <Progress className={styles.progress} size="md" colorScheme="blue" value={activity} />
        <div className={styles.percentage}> {percentage}%</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <AwardIcon />
        </div>
        <div>Airdrop</div>
      </div>
      <div>{contentEl}</div>
    </div>
  );
};
