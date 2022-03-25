import { IoTriangleSharp } from 'react-icons/io5';
import { numStr } from 'utils/commonUtil';
import styles from './IntervalChange.module.scss';

interface IntervalChangeProps {
  change: number;
  interval?: string | number;
  intervalUnits?: string;
}

function IntervalChange({ change: propsChange, interval, intervalUnits, ...rest }: IntervalChangeProps) {
  const change = Number.isNaN(propsChange) ? 0 : Math.round(propsChange * 100) / 100;

  return (
    <div className="flex justify-between items-center text-xs text-white bg-green-700 py-1 px-2 border rounded-xl">
      <IoTriangleSharp
        className={`${styles.triangle} ${change >= 0 ? styles.green : `${styles.red} ${styles.flip}`}`}
      />
      <div className="flex">
        <p className={`${styles.change} ${change >= 0 ? styles.green : styles.red}`}>{numStr(Math.abs(change))}%</p>
        {interval !== undefined && (
          <p className={`${styles.unit} ${change >= 0 ? styles.green : styles.red}`}>
            {interval}
            {intervalUnits}
          </p>
        )}
      </div>
    </div>
  );
}

export default IntervalChange;
