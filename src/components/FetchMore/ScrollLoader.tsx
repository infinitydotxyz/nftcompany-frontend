import React from 'react';
import { InView } from 'react-intersection-observer';
import styles from './ScrollLoader.module.scss';

const ScrollLoaderElement = ({ inView, ref, onFetchMore }: any) => {
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      onFetchMore();
    }
  }, [inView]);

  // render a placeholder to check if it's visible (inView) or not.
  return <div ref={ref} className={styles.element}></div>;
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
