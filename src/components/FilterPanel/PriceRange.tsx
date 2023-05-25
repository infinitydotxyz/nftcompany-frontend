import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';

const STEP = 1;
// the range component gets buggy when we set this to zero so set it to a small number
const MIN = 0.00000000001;
const MAX = 10000;

type Props = {
  values: number[];
  setValues: any;
  onFinalSetValue: any;
  className?: string;
  style?: React.CSSProperties;
};

function PriceRange({ values, setValues, className, style, onFinalSetValue }: Props) {
  return (
    <span className={className} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>0 ETH</div>
        <div>{MAX} ETH</div>
      </div>
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onFinalChange={(values) => onFinalSetValue(values)}
        onChange={(values) => {
          setValues(values);
        }}
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
                display: isDragged ? 'block' : 'none',
                bottom: '-36px',
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

export default PriceRange;
