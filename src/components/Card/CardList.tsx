import styles from './CardList.module.scss';
import Card from './Card'

type Props = {
  data: []
}

export default function CardList({ data }: Props) {
  return (
    <div className={styles.cardList}>
      {(data || []).map((item) => {
        return (
          <Card />
        );
      })}
    </div>
  );
}
