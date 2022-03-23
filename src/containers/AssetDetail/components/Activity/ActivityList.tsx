import React from 'react';
import { ActivityItem } from './ActivityItem';
import clsx from 'classnames';

interface ActivityListPropType {
  className?: string;
}

export const ActivityList: React.FC<ActivityListPropType> = ({ className }: ActivityListPropType) => {
  return (
    <div>
      {[0, 1, 2].map((item) => {
        return <ActivityItem key={item} />;
      })}
    </div>
  );
};
