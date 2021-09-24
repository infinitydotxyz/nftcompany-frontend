import React from 'react';
import styles from './InfoCard.module.scss';
import { UserReward } from '../types';

type Props = {
  data?: UserReward;
};

export const InfoCardRow = ({ data }: Props) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  return (
    <div className={styles.main}>
      <h3>My Rewards</h3>
      <div className={styles.cardGrid}>
        <InfoCard data={data} title="Angry" />
        <InfoCard data={data} title="Hello" />
        <InfoCard data={data} title="Hello" />
        <InfoCard data={data} title="Hello Guys" />
      </div>
    </div>
  );
};

// ============================================================

type IProps = {
  title: string;
  data: UserReward;
};

export const InfoCard = ({ title, data }: IProps) => {
  if (!data) {
    return <div>Nothing found</div>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.myRewardBox}>
        <h3>Listing Rewards</h3>
        <div>
          <div className={styles.infoRow}>
            <div className={styles.left}>APR</div>
            <div className={styles.right}>10%</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.left}>APR</div>
            <div className={styles.right}>10%</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.left}>APR</div>
            <div className={styles.right}>10%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
