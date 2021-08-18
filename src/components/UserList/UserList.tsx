import React from 'react';
import styles from './UserList.module.scss';

export type UserData = {
  id: string;
  name: string;
  avatar: string;
  bid: number;
};

type Props = {
  data: UserData[];
};

const UserList = ({ data }: Props) => {
  return (
    <ul className={styles.list}>
      {data.map((user) => {
        return (
          <li key={user.id}>
            <div className={styles.avatar}>
              <img src={user.avatar} />
            </div>
            <div className={styles.desc}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.action}>
                Place a bid <span className={styles.money}>{user.bid} ETH</span>
              </div>
            </div>
            <div className={styles.time}>Jun 14 - 4:12 PM</div>
          </li>
        );
      })}
    </ul>
  );
};

export default UserList;
