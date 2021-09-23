import React from 'react';
import { InView } from 'react-intersection-observer';

const ScrollLoaderElement = ({ inView, ref, onFetchMore, data, currentPage }: any) => {
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      onFetchMore();
    }
  }, [inView]);
  return <div ref={ref}>&nbsp;</div>; // render a placeholder to check if it's visible (inView) or not.
};

type ScrollLoaderProps = {
  onFetchMore: () => void;
};

export const ScrollLoader = ({ onFetchMore }: ScrollLoaderProps) => {
  return (
    <InView>
      {({ inView, ref }) => {
        return (
          <div ref={ref}>
            <ScrollLoaderElement inView={inView} onFetchMore={onFetchMore} />
          </div>
        );
      }}
    </InView>
  );
};
