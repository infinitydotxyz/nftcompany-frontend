import React from 'react';
import { InView } from 'react-intersection-observer';
import { Box } from '@chakra-ui/layout';
import { ITEMS_PER_PAGE } from 'utils/constants';

const FetchMoreElement = ({ inView, ref, onFetchMore, data, currentPage }: any) => {
  // console.log('inView', ' ', inView);
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      if (currentPage === 0 && data?.length < ITEMS_PER_PAGE) {
        return; // return if it's the first page with less items.
      }
      onFetchMore();
    }
  }, [inView]);
  return <div ref={ref}>&nbsp;</div>; // render a placeholder to check if it's visible (inView) or not.
};

type FetchMoreProps = {
  onFetchMore: () => void;
  data?: any[];
  currentPage?: number;
};

export const FetchMore = ({ onFetchMore, data, currentPage }: FetchMoreProps) => {
  return (
    <InView>
      {({ inView, ref }) => {
        // console.log('FetchMore inView:', inView);
        return (
          <div ref={ref}>
            <FetchMoreElement inView={inView} onFetchMore={onFetchMore} data={data} currentPage={currentPage} />
          </div>
        );
      }}
    </InView>
  );
};

export const getLastItemCreatedAt = (data: any[]) =>
  data?.length > 0 ? data[data.length - 1]?.metadata?.createdAt : '';

export const getLastItemBasePrice = (data: any[]) =>
  data?.length > 0 ? data[data.length - 1]?.metadata?.basePriceInEth : '';

export const NoData = ({
  isFetching,
  data,
  dataLoaded,
  currentPage
}: {
  isFetching: boolean;
  data: any[];
  dataLoaded?: boolean;
  currentPage?: number;
}) => {
  if (dataLoaded && !isFetching && data?.length === 0) {
    return <Box mt={10}>No Item To Display</Box>;
  }
  return null;
};
