import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';

const STEP = 0.1;
const MIN = 0.01;
const MAX = 10;

type Props = {
  values: number[];
  setValues: any;
  style?: React.CSSProperties;
};

export default function ({ values, setValues, style }: Props) {
  return (
    <span style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>0.01 ETH</div>
        <div>10 ETH</div>
      </div>
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={(values) => setValues(values)}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%'
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '8px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#3772FF', '#E6E8EC'],
                  min: MIN,
                  max: MAX
                }),
                alignSelf: 'center'
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '24px',
              width: '24px',
              borderRadius: '50%',
              backgroundColor: '#3772FF',
              border: '4px solid #FCFCFD',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-33px',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '18px',
                fontFamily: 'Poppins',
                padding: '4px 8px',
                borderRadius: '8px',
                backgroundColor: '#141416'
              }}
            >
              {values[0].toFixed(1)}
            </div>
          </div>
        )}
      />
    </span>
  );
}
