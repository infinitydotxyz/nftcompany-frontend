import React from 'react';
import { CardData } from 'types/Nft.interface';
import { uuidv4 } from 'utils/commonUtil';
import Card from './Card';
import styles from './CardList.module.scss';

type Props = {
  data: CardData[];
  action?: string;
  showItems?: string[];
  userAccount?: string;
  pageName?: string;
  onClickAction?: (item: any, action: string) => void;
};

const CardList = ({ data, showItems, userAccount, action, pageName, onClickAction }: Props): JSX.Element => {
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
            action={action}
            userAccount={userAccount}
            data={item}
            pageName={pageName}
            onClickAction={onClickAction}
          />
        );
      })}
    </div>
  );
};

export default CardList;
