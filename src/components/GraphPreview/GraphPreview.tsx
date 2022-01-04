import { Box, Link } from '@chakra-ui/layout';
import styles from './GraphPreview.module.scss';
import { IoTriangleSharp } from 'react-icons/io5';
import { Button } from '@chakra-ui/button';
import { numStr } from 'utils/commonUtil';
import { FormControl } from '@chakra-ui/react';
import LineGraph from 'components/LineGraph/LineGraph';

interface GraphPreviewProps {
  label: string;
  total: number;
  change: number;
  changeInterval: number;
  changeIntervalUnits: 'min' | 'hr' | 'day' | 'wk';
  link?: string;
  linkText?: string;
  data: { timestamp: number; y: number }[];
  dataLabel: string;
}

function GraphPreview(props: GraphPreviewProps) {
  return (
    <Box
      borderRadius="8px"
      bg="cardBgLight"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      padding="16px"
      maxWidth="180px"
      maxHeight="140px"
    >
      <p className={styles.label}>{props.label}</p>
      <Box display="flex" w="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
        <p className={styles.total}>{numStr(props.total)}</p>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <IoTriangleSharp
            className={`${styles.triangle} ${props.change > 0 ? styles.green : `${styles.red} ${styles.flip}`}`}
          />
          <Box display={'flex'} flexDirection={'row'}>
            <p className={`${styles.change} ${props.change > 0 ? styles.green : styles.red}`}>{numStr(props.change)}</p>
            <p className={`${styles.unit} ${props.change > 0 ? styles.green : styles.red}`}>
              {props.changeInterval}
              {props.changeIntervalUnits}
            </p>
          </Box>
        </Box>
      </Box>

      {props.data?.length > 0 && (
        <LineGraph
          width={200}
          height={100}
          data={props.data}
          displayProps={{
            x: { label: 'members', strokeColor: '#CED6DC' }
          }}
          labelFormatter={(label: string, payload) => 'Discord'}
          tooltip={true}
        />
      )}

      {props.link && props.linkText && (
        <Link marginTop="16px" width="100%" href={props.link} target="_blank">
          <Button width="100%" type="submit">
            {props.linkText}
          </Button>
        </Link>
      )}
    </Box>
  );
}

export default GraphPreview;
