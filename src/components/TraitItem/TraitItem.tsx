import React from 'react';
import { Spacer } from '@chakra-ui/react';
import classes from './TraitItem.module.scss';

interface TraitItemPropType {
  traitType: string;
  percentage: number;
  traitValue: string | number;
}

export const TraitItem: React.FC<TraitItemPropType> = ({ traitType, percentage, traitValue }: TraitItemPropType) => {
  return (
    <div className={classes.traitItem}>
      <h3>{traitType}</h3>
      <div className={classes.traitValue}>{traitValue}</div>
      <Spacer />
      <div className={classes.badge}>{percentage}% have this</div>
    </div>
  );
};
