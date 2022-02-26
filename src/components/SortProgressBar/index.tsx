import { Spacer } from '@chakra-ui/layout';
import { SortArrows } from 'components/SortButton/SortArrows';
import React from 'react';
import { OrderDirection } from 'services/Stats.service';
import useResizeObserver from 'use-resize-observer';
import { numStr } from 'utils/commonUtil';
import styles from './styles.module.scss';

type Props = {
  onClick: () => void;
  direction: '' | OrderDirection.Ascending | OrderDirection.Descending;
  percent?: number;
};

export const SortProgressBar = ({ onClick, direction, percent = 0 }: Props): JSX.Element => {
  return (
    <div className={styles.sortBar} onClick={onClick}>
      <ProgressBar percent={percent} />
      <SortArrows direction={direction} />
    </div>
  );
};

type Props2 = {
  percent?: number;
};

export const ProgressBar = ({ percent = 0 }: Props2): JSX.Element => {
  const { ref, width = 1 } = useResizeObserver<HTMLDivElement>({ box: 'content-box' });
  let x = '';

  let p = 0;
  let noVotes = false;

  if (Number.isNaN(percent)) {
    x = 'No votes';
    noVotes = true;
  } else {
    p = percent;
    x = `${numStr(Math.floor(percent))}%`;
  }

  return (
    <div ref={ref} className={styles.progressBar}>
      <div className={styles.fill} style={{ width: width * (p / 100) }} />

      <div className={styles.content}>
        {!noVotes && (
          <>
            <div>Trust</div>
            <Spacer />
            <div>{x}</div>
          </>
        )}
        {noVotes && (
          <>
            <div style={{ textAlign: 'center', width: '100%' }}>{x}</div>
          </>
        )}
      </div>
    </div>
  );
};
