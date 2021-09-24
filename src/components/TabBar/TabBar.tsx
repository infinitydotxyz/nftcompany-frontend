import * as React from 'react';
import styles from './TabBar.module.scss';

export type TabItem = {
  id: string;
  label?: any;
};

type Props = {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab?: (activeTab: string) => void;
};

const TabBar = ({ tabs, activeTab, setActiveTab }: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <ul>
          {tabs.map((tab: TabItem) => {
            // const tab = tabs[tabKey];
            return (
              <li key={tab.id} onClick={() => setActiveTab && setActiveTab(tab.id)}>
                <a className={activeTab === tab.id ? styles.active : ''}>{tab.label}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TabBar;
