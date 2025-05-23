/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { every, isEqual, last, range } from 'lodash';
import ReactSlider from 'react-slider';
import { Flex, Grid, Heading, Input, Text } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import useDebouncedEffect from '../../utils/useDebouncedEffect';
import translations from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const markGap = 20;

const calcMarks = ({ min, max }) => {
  const roundedMin = Math.ceil(min / markGap) * markGap;
  return range(roundedMin, max, markGap);
};

const TimeInput = ({ number, text, handler, inputError }) => (
  <Flex align="center" display={['none', 'block']}>
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
  const { locale } = useLocale();
  const [{ dates, year }, dispatch] = useImages();
  const [sliderRange, setSliderRange] = useState(triple ? [dates[0], year, dates[1]] : dates);
  const [tempRange, setTempRange] = useState(sliderRange);
  const [inputError, setInputError] = useState(false);

  const tooltipText = triple
    ? [`${translations.imageStart[locale]}: `, '', `${translations.imageEnd[locale]}: `]
    : [`${translations.imageStart[locale]}: `, `${translations.imageEnd[locale]}: `];

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
    <Grid
      templateColumns={['1fr', `${triple ? '45px 60px' : '65px repeat(2, 60px)'} 1fr`]}
      columnGap={6}
      alignItems="center"
      className="intro___timeline"
    >
      <Flex alignItems="center" display={['none', 'block']}>
        <Heading size="md" m={0} fontSize={18} fontWeight="bold" whiteSpace="nowrap">
          {triple ? `${translations.year[locale]}:` : `${translations.year[locale]}s:`}
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
        className={`___slider${triple ? ' ___triple' : ''}`}
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
        minDistance={0}
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
