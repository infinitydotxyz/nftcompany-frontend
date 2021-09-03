import styles from './CardList.module.scss';
import Card, { CardData } from './Card';

type Props = {
  data: CardData[];
  viewInfo?: boolean;
};

export default function CardList({ data, viewInfo }: Props) {
  return (
    <div className={styles.cardList}>
      {(data || []).map((item) => {
        if (!item) {
          return null;
        }
        return <Card key={item?.id} data={item} viewInfo={viewInfo} />;
      })}
    </div>
  );
}
