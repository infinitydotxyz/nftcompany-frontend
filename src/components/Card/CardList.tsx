import styles from './CardList.module.scss';
import Card, { CardData } from './Card';

type Props = {
  data: CardData[];
  viewInfo?: boolean;
  actions?: string[];
  onClickAction?: (item: any, action: string) => void;
};

export default function CardList({ data, viewInfo, actions, onClickAction }: Props) {
  return (
    <div className={styles.cardList}>
      {(data || []).map((item) => {
        if (!item) {
          return null;
        }
        return <Card key={item?.id || item?.title} actions={actions} data={item} viewInfo={viewInfo} onClickAction={onClickAction} />;
      })}
    </div>
  );
}
