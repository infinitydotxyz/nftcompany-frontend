import * as React from 'react';
import styles from './TabBar.module.scss';

const TabBar = () => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <ul>
          <li>
            <a>Info</a>
          </li>
          <li>
            <a>Owner</a>
          </li>
          <li>
            <a className={styles.active}>History</a>
          </li>
          <li>
            <a>Bids</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TabBar;
