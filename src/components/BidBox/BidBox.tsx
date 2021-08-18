import React from 'react';
import styles from './BidBox.module.scss';

export type UserData = {
  id: string;
  name: string;
  avatar: string;
  bid: number;
};

type Props = {
  user: UserData;
};

const BidBox = ({ user }: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.head}>
        <div className={styles.avatar}>
          <img src={user.avatar} />
        </div>
        <div className={styles.desc}>
          <div className={styles.info}>
            Highest bid by <span>{user.name}</span>
          </div>
          <div className={styles.action}>
            <span className={styles.money}>{user.bid} ETH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidBox;
