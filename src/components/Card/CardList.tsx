import React from 'react';
import { CardData } from 'types/Nft.interface';
import { uuidv4 } from 'utils/commonUtil';
import Card from './Card';
import styles from './CardList.module.scss';

type Props = {
  data: CardData[];
  excludedMaker?: string;
  viewInfo?: boolean;
  action?: string;
  showItems?: string[];
  onClickAction?: (item: any, action: string) => void;
};
export default function CardList({ data, excludedMaker, viewInfo, showItems, action, onClickAction }: Props) {
  return (
    <div className={`${styles.cardList}`}>
      {(data || []).map((item) => {
        if (!item) {
          return null;
        }
        if (excludedMaker && item?.maker === excludedMaker) {
          return null;
        }
        return (
          <Card
            key={item?.id || uuidv4()}
            showItems={showItems}
            action={action}
            data={item}
            viewInfo={viewInfo}
            onClickAction={onClickAction}
          />
        );
      })}
    </div>
  );
}
