import React, { useState } from 'react';
import { InView, useInView } from 'react-intersection-observer';
import { Box } from '@chakra-ui/layout';

const FetchMoreElement = ({ inView, ref, onFetchMore }: any) => {
  // console.log('inView', ' ', inView);
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      onFetchMore();
    }
  }, [inView]);
  return <div ref={ref}>{/* <h2>Loading...</h2> */}</div>;
};

export const FetchMore = ({ onFetchMore }: any) => {
  return (
    <InView>
      {({ inView, ref }) => {
        // console.log('FetchMore inView:', inView);
        return (
          <div ref={ref}>
            <FetchMoreElement inView={inView} onFetchMore={onFetchMore} />
          </div>
        );
      }}
    </InView>
  );
};

export const getLastItemCreatedAt = (data: any[]) =>
  data?.length > 0 ? data[data.length - 1]?.metadata?.createdAt : '';

export const NoData = ({ isFetching, data, currentPage }: { isFetching: boolean, data: any[]; currentPage: number }) => {
  if (!isFetching && data?.length === 0 && currentPage >= 1) {
    return (
      <Box mt={10}>No Item To Display</Box>
    )
  }
  return null;
}
