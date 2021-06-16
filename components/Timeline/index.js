/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { range } from 'lodash';
import ReactSlider from 'react-slider';
import { Grid, Input, Text, Flex, Heading } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

const markGap = 20;

const calcMarks = ({ min, max }) => {
  const roundedMin = Math.ceil(min / markGap) * markGap;
  return range(roundedMin, max, markGap);
};

const TimeInput = ({ number, text, handler, min, max }) => (
  <Flex align="center">
    {text && (
      <Text
        textTransform="uppercase"
        fontSize={12}
        position="absolute"
        mt="-39px"
        ml="6px"
        backgroundColor="white"
        zIndex={1}
      >
        {text}
      </Text>
    )}
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
  </Flex>
);

const Timeline = ({ min, max, triple }) => {
  const [, dispatch] = useImages();
  const [sliderRange, setSliderRange] = useState(
    triple ? [min, Math.round((min + max) / 200) * 100, max] : [min, max]
  );

  useEffect(() => {
    let dates = sliderRange;
    if (triple) {
      dates = [sliderRange[0], sliderRange[2]];
      dispatch(['YEAR', sliderRange[1]]);
    }
    dispatch(['DATES', dates]);
  }, [sliderRange]);

  return (
    <Grid templateColumns={`${triple ? '35px 60px' : 'repeat(3, 60px)'} 1fr`} columnGap={6}>
      <Flex alignItems="center">
        <Heading size="sm" m={0} fontSize={18} fontWeight="bold">
          {triple ? 'Year:' : 'Years:'}
        </Heading>
      </Flex>
      {triple ? (
        <TimeInput
          min={sliderRange[0]}
          max={sliderRange[2]}
          number={sliderRange[1]}
          handler={value => setSliderRange([sliderRange[0], value, sliderRange[2]])}
        />
      ) : (
        <>
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
        </>
      )}
      <ReactSlider
        className={`___slider${triple && ' ___triple'}`}
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
        defaultValue={sliderRange}
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
  triple: PropTypes.bool,
};

Timeline.defaultProps = {
  triple: false,
};

export default Timeline;
