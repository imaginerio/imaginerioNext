/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { range, every, last, isEqual } from 'lodash';
import ReactSlider from 'react-slider';
import { Grid, Input, Text, Flex, Heading } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import useDebouncedEffect from '../../utils/useDebouncedEffect';

const markGap = 20;

const calcMarks = ({ min, max }) => {
  const roundedMin = Math.ceil(min / markGap) * markGap;
  return range(roundedMin, max, markGap);
};

const TimeInput = ({ number, text, handler, inputError }) => (
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
      isInvalid={inputError}
      p={1}
      type="number"
      fontSize={13}
      textAlign="center"
      fontWeight="bold"
      value={number}
      onChange={({ target: { value } }) => handler(value)}
    />
  </Flex>
);

const Timeline = ({ min, max, triple }) => {
  const [{ dates, year }, dispatch] = useImages();
  const [sliderRange, setSliderRange] = useState(triple ? [dates[0], year, dates[1]] : dates);
  const [tempRange, setTempRange] = useState(sliderRange);
  const [inputError, setInputError] = useState(false);

  const tooltipText = triple
    ? ['Image Start: ', '', 'Image End: ']
    : ['Image Start: ', 'Image End: '];

  useEffect(() => {
    let newDates = sliderRange;
    setTempRange(sliderRange);
    setInputError(false);
    dispatch(['SET_YEAR_DRAGGING', true]);
    if (triple) {
      newDates = [sliderRange[0], sliderRange[2]];
      dispatch(['YEAR', sliderRange[1]]);
    }
    dispatch(['DATES', newDates]);
  }, [sliderRange]);

  useDebouncedEffect(() => dispatch(['SET_YEAR_DRAGGING', false]), [sliderRange], 1000);

  useEffect(() => {
    if (
      every(tempRange, t => t >= min && t <= max) &&
      every(tempRange, (t, i) => last(tempRange) === t || t <= tempRange[i + 1])
    ) {
      setSliderRange(tempRange);
    } else {
      setInputError(true);
    }
  }, [tempRange]);

  useEffect(() => {
    const newDates = triple ? [dates[0], year, dates[1]] : dates;
    if (!isEqual(newDates, sliderRange)) {
      setSliderRange(newDates);
    }
  }, [triple, dates, year]);

  return (
    <Grid templateColumns={`${triple ? '35px 60px' : 'repeat(3, 60px)'} 1fr`} columnGap={6}>
      <Flex alignItems="center">
        <Heading size="sm" m={0} fontSize={18} fontWeight="bold">
          {triple ? 'Year:' : 'Years:'}
        </Heading>
      </Flex>
      {triple ? (
        <TimeInput
          inputError={inputError}
          number={tempRange[1]}
          handler={value => setTempRange([sliderRange[0], parseInt(value, 10), sliderRange[2]])}
        />
      ) : (
        <>
          <TimeInput
            inputError={inputError}
            text="start"
            number={tempRange[0]}
            handler={value => setTempRange([parseInt(value, 10), sliderRange[1]])}
          />
          <TimeInput
            inputError={inputError}
            text="end"
            number={tempRange[1]}
            handler={value => setTempRange([sliderRange[0], parseInt(value, 10)])}
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
        renderThumb={(props, { index, valueNow }) => (
          <div {...props}>
            <div className="___tooltip">{`${tooltipText[index]}${valueNow}`}</div>
          </div>
        )}
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
