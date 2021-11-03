import React, { useState } from 'react';
import { apiGet } from 'utils/apiUtil';
import { ITEMS_PER_PAGE } from 'utils/constants';
import { useAppContext } from 'utils/context/AppContext';
import cardListStyles from '../Card/CardList.module.scss';
import { CollectionCard, loadingCardData } from 'components/CollectionCards/CollectionCard';
import { Box } from '@chakra-ui/layout';
import { CollectionCardEntry } from 'types/rewardTypes';

type Props = {
  asSection?: boolean;
};

export default function FeaturedCollections({ asSection }: Props) {
  const { showAppError } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CollectionCardEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async () => {
    setIsFetching(true);
    const { result, error } = await apiGet(`/featured-collections`, {});
    setIsFetching(false);
    if (error) {
      showAppError(`${error?.message}`);
      return;
    }
    const collections = result.collections.map((item: CollectionCardEntry) => {
      return { ...item, hasBlueCheck: true }; // default: feature verified collections only.
    });
    setData(collections);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  return (
    <>
      <div className="section-bar">
        <div className="tg-title">Featured</div>
      </div>

      <Box mt={4} className={cardListStyles.cardList}>
        {data?.length === 0 && isFetching ? (
          <>
            <CollectionCard key={'loading---1'} entry={loadingCardData} isFeatured={true} />
            <CollectionCard key={'loading---2'} entry={loadingCardData} isFeatured={true} />
          </>
        ) : null}

        {data.map((item) => {
          return <CollectionCard key={item.id} entry={item} isFeatured={true} />;
        })}
      </Box>
    </>
  );
}
