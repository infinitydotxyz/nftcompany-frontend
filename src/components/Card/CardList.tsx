import React from 'react';
import { CardData } from 'types/Nft.interface';
import Card from './Card';
import styles from './CardList.module.scss';

type Props = {
  data: CardData[];
  viewInfo?: boolean;
  actions?: string[];
  showItems?: string[];
  onClickAction?: (item: any, action: string) => void;
};
// if items used their title as a key they ran the risk of having the same value
// to fix this we can use a guid generator instead
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export default function CardList({ data, viewInfo, showItems, actions, onClickAction }: Props) {
  React.useEffect(() => {
    // console.log('CardList useEffect.')
  }, []);

  return (
    <div className={`${styles.cardList}`}>
      {(data || []).map((item) => {
        if (!item) {
          return null;
        }
        return (
          <Card
            key={item?.id || uuidv4()}
            showItems={showItems}
            actions={actions}
            data={item}
            viewInfo={viewInfo}
            onClickAction={onClickAction}
          />
        );
      })}
    </div>
  );
}
