import React from 'react';
import { LineChart, Tooltip, Line } from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

type WithTimestamp = {
  timestamp: number;
};

type Data = { [key: string]: number } & WithTimestamp;

interface LineGraphProps {
  width: number;
  height: number;
  tooltip: boolean;
  data: Data[];
  displayProps: Record<keyof Omit<Data, 'timestamp'>, { label: string; strokeColor: string }>;
  labelFormatter?: (label: any, payload: Payload<string, string>[]) => React.ReactNode;
}

function LineGraph(props: LineGraphProps) {
  return (
    <LineChart width={props.width} height={props.height} data={props.data}>
      {props.tooltip && (
        <Tooltip
          formatter={(value: number, name: string, props: any) => {
            const date = new Date(props.payload.timestamp);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            console.log(props.value);
            return [`${name} ${Math.floor(value)}`, `${month}/${day}`];
          }}
          labelFormatter={props.labelFormatter}
        />
      )}
      {Object.entries(props.displayProps).map(([dataKey, { label, strokeColor }]) => {
        return <Line key={dataKey} type="natural" dataKey={dataKey} stroke={strokeColor} dot={false} name={label} />;
      })}
    </LineChart>
  );
}

export default LineGraph;
