import { Box, SimpleGrid } from '@chakra-ui/react';
import InfoGroup from 'components/InfoGroup/InfoGroup';
import { CollectionStats as CollectionStatsType } from 'services/Collections.service';
import CollectionStat from './CollectionStat';

function CollectionStats(props: { stats: CollectionStatsType }) {
  const statsCount = props.stats.count && (
    <CollectionStat key="total-num-items" name="Items" value={props.stats.count} />
  );
  const owners = props.stats.owners && <CollectionStat key="total-owners" name="Owners" value={props.stats.owners} />;
  const floorPrice = props.stats.floorPrice && (
    <CollectionStat key="floor-price" name="Floor price" value={Math.floor(props.stats.floorPrice * 1000) / 1000} />
  );
  const volumeTraded = props.stats.total.volume && (
    <CollectionStat key="volume-traded" name="Volume traded" value={Math.floor(props.stats.total.volume)} />
  );
  const items = [statsCount, owners, floorPrice, volumeTraded].filter((item) => item);
  return (
    <InfoGroup title="Collection Stats" minChildWidth="80px">
      {items}
    </InfoGroup>
  );
}

export default CollectionStats;
