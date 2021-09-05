import styles from './CardList.module.scss';
import Card, { CardData } from './Card';

type Props = {
  data: CardData[];
  viewInfo?: boolean;
  onClickAction?: (item: any, action: string) => void;
};

export default function CardList({ data, viewInfo, onClickAction }: Props) {
  return (
    <div className={styles.cardList}>
      {(data || []).map((item) => {
        if (!item) {
          return null;
        }
        return <Card key={item?.id || item?.title} data={item} viewInfo={viewInfo} onClickAction={onClickAction} />;
      })}
    </div>
  );
}
