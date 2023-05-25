import { Box, Link } from '@chakra-ui/layout';
import styles from './GraphPreview.module.scss';
import { IoTriangleSharp } from 'react-icons/io5';
import { Button } from '@chakra-ui/button';
import { numStr } from 'utils/commonUtil';
import LineGraph from 'components/LineGraph/LineGraph';
import React, { useEffect, useRef, useState } from 'react';
import IntervalChange from 'components/IntervalChange/IntervalChange';

export type SocialData = { timestamp: number; y: number };

interface GraphPreviewProps {
  /**
   * label for the graph (e.g. Twitter followers)
   */
  label: string;

  changeInterval: number;

  /**
   * data to be displayed
   */
  data: SocialData[];
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

interface GraphPreviewPropsWithButton extends GraphPreviewProps {
  onClick: () => void;
  /**
   * text on the button
   */
  buttonText?: string;
}

function GraphPreview(props: GraphPreviewProps | GraphPreviewPropsWithLink | GraphPreviewPropsWithButton) {
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
      const percentChange = (value: number, change: number) => {
        return 100 * (change / value);
      };
      const change = mostRecentDataPoint.y - oldestDataPointWithinInterval.y;
      setIntervalChange(percentChange(oldestDataPointWithinInterval.y, change));
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
      width="200px"
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
        <IntervalChange
          change={Math.floor(intervalChange * 100) / 100}
          interval={props.changeInterval}
          intervalUnits="hrs"
        />
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

      {'onClick' in props && (
        <Link marginTop="16px" width="100%" onClick={props.onClick} target="_blank" _hover={{ textDecoration: 'none' }}>
          <Button size="sm" width="100%" type="submit">
            {props.buttonText}
          </Button>
        </Link>
      )}
    </Box>
  );
}

export default GraphPreview;
