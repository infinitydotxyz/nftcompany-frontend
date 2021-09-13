import React, { useState } from 'react';
import { InView, useInView } from 'react-intersection-observer';

const FetchMoreElement = ({ inView, ref, onFetchMore }: any) => {
  // console.log('inView', ' ', inView);
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      onFetchMore();
    }
  }, [inView]);
  return (
    <div ref={ref}>
      <h2>Loading...</h2>
    </div>
  );
};

export const FetchMoreInView = ({ onFetchMore }: any) => {
  return (
    <InView>  
      {({ inView, ref }) => {
        return (
          <div ref={ref}>
            <FetchMoreElement
              inView={inView}
              onFetchMore={onFetchMore}
            />
          </div>
        );
      }}
    </InView>
  );
};
