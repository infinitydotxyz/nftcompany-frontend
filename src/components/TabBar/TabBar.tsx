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
          {tabs.map((tab: any) => {
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
