import { CollectionStats as CollectionStatsType } from 'services/Collections.service';
import { numStr } from 'utils/commonUtil';
import CollectionStat from './CollectionStat';

function CollectionStats(props: { stats: CollectionStatsType }) {
  const statsCount = props.stats.count && (
    <CollectionStat key="total-num-items" name="Items" value={numStr(props.stats.count)} />
  );
  const owners = props.stats.owners && (
    <CollectionStat key="total-owners" name="Owners" value={numStr(props.stats.owners)} />
  );
  const floorPrice = props.stats.floorPrice && (
    <CollectionStat key="floor-price" name="Floor price" value={numStr(props.stats.floorPrice)} unit="ETH" />
  );
  const volumeTraded = props.stats.total.volume && (
    <CollectionStat
      key="volume-traded"
      name="Volume traded"
      value={numStr(Math.floor(props.stats.total.volume))}
      unit="ETH"
    />
  );
  const items = [statsCount, owners, floorPrice, volumeTraded].filter((item) => item);
  return <>{items}</>;
}

export default CollectionStats;
