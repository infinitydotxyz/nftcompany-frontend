import React from 'react';
import { numStr } from 'utils/commonUtil';
import styles from './RewardCard.module.scss';
import { Countdown } from 'components/Countdown/Countdown';
import { AlarmIcon, AwardIcon, LeaderboardIcon, StatsIcon } from 'components/Icons/Icons';
import { LeaderBoard, UserReward } from 'types/rewardTypes';
import { LeaderBoardTable } from 'components/LeaderBoard/LeaderBoardTable';
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
    const val = numStr(i.value);

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

export const LeaderboardCard = ({ data }: XProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <div className={styles.icon}>
          <LeaderboardIcon boxSize={8} />
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

// ==========================================================
// ==========================================================

type AProps = {
  reward: UserReward;
};

export const AirdropCard = ({ reward }: AProps) => {
  const classes = [styles.infoRow];
  classes.push(styles.topBorder);

  const items: DataItem[] = [];

  const eligible = reward.rewardTier.eligible;
  const ratio = reward.doneSoFar / reward.rewardTier.threshold;

  const activity = ratio * 100;
  const percentage = activity.toFixed(2);

  items.push({ title: 'Eligible tokens', value: eligible });
  items.push({ title: 'Transacted', value: +reward.doneSoFar.toFixed(3) + ' / ' + reward.rewardTier.threshold + ' ETH' });

  const divs = items.map((i) => {
    const val = i.value;

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
        <div className={styles.icon}>
          <AwardIcon />
        </div>
        <div>Airdrop</div>
      </div>
      <div>{divs}</div>
      <Progress className={styles.progress} size="md" colorScheme="blue" value={activity} />

      <div className={styles.percentage}> {percentage}%</div>
    </div>
  );
};
