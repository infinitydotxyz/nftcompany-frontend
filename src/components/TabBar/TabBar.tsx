import * as React from 'react';
import styles from './TabBar.module.scss';

type Props = {
  tabs: any;
  activeTab: string;
  setActiveTab?: (activeTab: string) => void;
};

const TabBar = ({ tabs, activeTab, setActiveTab }: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <ul>
          {Object.keys(tabs).map((tabKey: any) => {
            return (
              <li onClick={() => setActiveTab && setActiveTab(tabKey)}>
                <a className={activeTab === tabKey ? styles.active : ''}>{tabs[tabKey].label}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TabBar;
