import React, { forwardRef, RefObject } from 'react';
import { InView } from 'react-intersection-observer';
import styles from './ScrollLoader.module.scss';

type Props = {
  inView: boolean;
  onFetchMore: () => void;
  bottom: boolean;
};

const ScrollLoaderElement = forwardRef(({ inView, bottom, onFetchMore }: Props, ref: any): JSX.Element => {
  React.useEffect(() => {
    if (inView === true && onFetchMore) {
      onFetchMore();
    }
  }, [inView]);

  // the style sets a relative offset -200 so that it will trigger earlier
  return <div ref={ref} className={bottom ? styles.bottomTrigger : styles.topTrigger}></div>;
});

ScrollLoaderElement.displayName = 'Search';

type ScrollLoaderProps = {
  onFetchMore: () => void;
};

export const ScrollLoader = ({ onFetchMore }: ScrollLoaderProps) => {
  return (
    <>
      <InView>
        {({ inView, ref }) => {
          return (
            <div className={styles.inView}>
              <ScrollLoaderElement ref={ref} bottom={false} inView={inView} onFetchMore={onFetchMore} />
            </div>
          );
        }}
      </InView>

      <InView>
        {({ inView, ref }) => {
          return (
            <div className={styles.inView}>
              <ScrollLoaderElement ref={ref} bottom={true} inView={inView} onFetchMore={onFetchMore} />
            </div>
          );
        }}
      </InView>
    </>
  );
};
