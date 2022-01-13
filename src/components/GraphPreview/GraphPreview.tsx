import { Box, Link } from '@chakra-ui/layout';
import styles from './GraphPreview.module.scss';
import { IoTriangleSharp } from 'react-icons/io5';
import { Button } from '@chakra-ui/button';
import { numStr } from 'utils/commonUtil';
import LineGraph from 'components/LineGraph/LineGraph';
import React, { useEffect, useRef, useState } from 'react';
import IntervalChange from 'components/IntervalChange/IntervalChange';

interface GraphPreviewProps {
  /**
   * label for the graph (e.g. Twitter followers)
   */
  label: string;

  changeInterval: number;

  /**
   * data to be displayed
   */
  data: { timestamp: number; y: number }[];
  /**
   * units of the y axis
   */
  dataUnits: string;
}

interface GraphPreviewPropsWithLink extends GraphPreviewProps {
  link?: string;
  /**
   * text on the link button
   */
  linkText?: string;
}

function GraphPreview(props: GraphPreviewProps | GraphPreviewPropsWithLink) {
  const containerRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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
      const interval = props.changeInterval * ONE_HOUR;
      let oldestDataPointWithinInterval = mostRecentDataPoint;
      for (const item of dataSortedFromMostRecentToLeastRecent) {
        const minTSWithinInterval = mostRecentDataPoint.timestamp - interval;
        if (item.timestamp > minTSWithinInterval) {
          oldestDataPointWithinInterval = item;
        } else {
          break;
        }
      }
      setIntervalChange(mostRecentDataPoint.y - oldestDataPointWithinInterval.y);
    }
  }, [props.data]);

  useEffect(() => {
    const { width, height } = containerRef?.current?.getBoundingClientRect();
    setDimensions({ width: width || 140, height: height || 25 });
  }, [containerRef?.current]);

  return (
    <Box
      borderRadius="8px"
      bg="cardBgLight"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      padding="16px"
      width="180px"
    >
      <p className={styles.label}>{props.label}</p>
      <Box
        ref={containerRef}
        display="flex"
        w="100%"
        marginBottom="16px"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <p className={styles.total}>{numStr(total)}</p>
        <IntervalChange change={intervalChange} interval={props.changeInterval} intervalUnits="hrs" />
      </Box>

      <LineGraph
        width={dimensions.width}
        height={25}
        data={data}
        displayProps={{
          y: { label: props.dataUnits, strokeColor: '#CED6DC' }
        }}
        tooltip={false}
      />

      {'link' in props && (
        <Link marginTop="16px" width="100%" href={props.link} target="_blank" _hover={{ textDecoration: 'none' }}>
          <Button size="sm" width="100%" type="submit">
            {props.linkText}
          </Button>
        </Link>
      )}
    </Box>
  );
}

export default GraphPreview;
