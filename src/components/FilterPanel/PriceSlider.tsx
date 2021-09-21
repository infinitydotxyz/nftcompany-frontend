import { useAppSearchContext } from 'hooks/useSearch';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from 'react';
const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const MAX = 1000;
const getMaxMarker = (maxPrice: number) => {
  if (maxPrice < MAX) {
    return MAX + 1;
  } else {
    return maxPrice + 1;
  }
};
const PriceSlider = () => {
  const { filterState, setFilterState } = useAppSearchContext();
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(1000);
  return (
    <>
      <Range
        value={[sliderMin, sliderMax]}
        min={0}
        max={getMaxMarker(sliderMax)}
        tipProps={{
          visible: true
        }}
        allowCross={false}
        onAfterChange={([priceMin, priceMax]) => {
          setFilterState({ ...filterState, priceMin, priceMax } as any);
        }}
        marks={{
          0: `0`,
          [getMaxMarker(sliderMax)]: `${getMaxMarker(sliderMax) - 1}`
        }}
        railStyle={{
          color: '#4047ff',
          backgroundColor: 'gray'
        }}
        trackStyle={[
          {
            backgroundColor: '#4047ff',
            border: 0
          }
        ]}
        handleStyle={[
          {
            backgroundColor: 'blue',
            color: '#4047ff',
            border: 0
          }
        ]}
        tipFormatter={(value) => `${value}`}
        onChange={([priceMin, priceMax]) => {
          setSliderMax(priceMax);
          setSliderMin(priceMin);
        }}
      />
    </>
  );
};
export default PriceSlider;
