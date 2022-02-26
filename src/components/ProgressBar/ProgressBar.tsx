import { Spacer } from '@chakra-ui/layout';
import React from 'react';
import useResizeObserver from 'use-resize-observer';
import { numStr } from 'utils/commonUtil';
import styles from './styles.module.scss';

type Props = {
  percent?: number;
};

export const ProgressBar = ({ percent = 0 }: Props): JSX.Element => {
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
