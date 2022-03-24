import { Box, Link } from '@chakra-ui/layout';
import styles from './GraphPreview.module.scss';
import { IoTriangleSharp } from 'react-icons/io5';
import { Button } from '@chakra-ui/button';
import { numStr } from 'utils/commonUtil';
import LineGraph from 'components/LineGraph/LineGraph';
import React, { useEffect, useRef, useState } from 'react';
import IntervalChange from 'components/IntervalChange/IntervalChange';
import { SocialData } from './GraphPreview';

interface GraphPreviewForChipProps {
  changeInterval?: number;

  /**
   * data to be displayed
   */
  data: SocialData[];
}

function GraphPreviewForChip(props: GraphPreviewForChipProps) {
  const [intervalChange, setIntervalChange] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<{ timestamp: number; y: number }[]>([]);

  useEffect(() => {
    if (props.data?.length > 0) {
      const dataSortedFromOldestToMostRecent = props.data;
      const dataSortedFromMostRecentToLeastRecent = props.data.sort(
        (itemA, itemB) => itemB.timestamp - itemA.timestamp
      );
      const mostRecentDataPoint = dataSortedFromMostRecentToLeastRecent[0];
      setTotal(mostRecentDataPoint.y);
      setData(dataSortedFromOldestToMostRecent);

      const ONE_HOUR = 3.6e6;
      const interval = (props.changeInterval ?? 0) * ONE_HOUR;
      let oldestDataPointWithinInterval = mostRecentDataPoint;
      for (const item of dataSortedFromMostRecentToLeastRecent) {
        const minTSWithinInterval = mostRecentDataPoint.timestamp - interval;
        if (item.timestamp > minTSWithinInterval) {
          oldestDataPointWithinInterval = item;
        } else {
          break;
        }
      }
      const percentChange = (value: number, change: number) => {
        return 100 * (change / value);
      };
      const change = mostRecentDataPoint.y - oldestDataPointWithinInterval.y;
      setIntervalChange(percentChange(oldestDataPointWithinInterval.y, change));
    }
  }, [props.data]);

  return (
    <div className="flex items-center">
      <span className="mr-2">{numStr(total)}</span>
      <IntervalChange
        change={Math.floor(intervalChange * 100) / 100}
        interval={props.changeInterval}
        intervalUnits="hrs"
      />
    </div>
  );
}

export default GraphPreviewForChip;
