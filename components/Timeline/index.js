/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import ReactSlider from 'react-slider';
import { Grid, Input, Box, Text } from '@chakra-ui/react';

const markGap = 20;

const calcMarks = ({ min, max }) => {
  const roundedMin = Math.ceil(min / markGap) * markGap;
  return range(roundedMin, max, markGap);
};

const TimeInput = ({ number, text, handler, min, max }) => (
  <Box>
    <Text
      textTransform="uppercase"
      fontSize={12}
      position="absolute"
      mt="-9px"
      ml="6px"
      backgroundColor="white"
      zIndex={1}
    >
      {text}
    </Text>
    <Input
      p={1}
      type="number"
      min={min}
      max={max}
      fontSize={13}
      textAlign="center"
      fontWeight="bold"
      value={number}
      onChange={({ target: { value } }) => handler(value)}
    />
  </Box>
);

const Timeline = ({ min, max, handler }) => {
  const [sliderRange, setSliderRange] = useState([min, max]);

  useEffect(() => handler(sliderRange), [sliderRange]);

  return (
    <Grid templateColumns="repeat(2, 50px) 1fr" columnGap={4}>
      <TimeInput
        text="start"
        min={min}
        max={sliderRange[1]}
        number={sliderRange[0]}
        handler={value => setSliderRange([value, sliderRange[1]])}
      />
      <TimeInput
        text="end"
        min={sliderRange[0]}
        max={max}
        number={sliderRange[1]}
        handler={value => setSliderRange([sliderRange[0], value])}
      />
      <ReactSlider
        className="___slider"
        thumbClassName="___thumb"
        trackClassName="___track"
        value={sliderRange}
        onChange={setSliderRange}
        marks={calcMarks({ min, max })}
        markClassName="___mark"
        renderMark={props => (
          <div {...props}>
            <span>{props.key % 100 === 0 ? props.key : ''}</span>
          </div>
        )}
        defaultValue={[min, max]}
        min={min}
        max={max}
        ariaLabel={['Lower thumb', 'Upper thumb']}
        ariaValuetext={state => `Thumb value ${state.valueNow}`}
        pearling
        minDistance={10}
      />
    </Grid>
  );
};

Timeline.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

export default Timeline;
