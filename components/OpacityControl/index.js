import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { FiLayers, FiXCircle } from 'react-icons/fi';
import {
  Box,
  HStack,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
} from '@chakra-ui/react';

import translation from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const styleProps = {
  boxShadow: 'md',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
};

const sharedPropTypes = {
  opacity: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
};

const OpacitySlider = ({ opacity, handler, setIsOpen }) => (
  <HStack {...styleProps} w={300} h="30px" px="10px">
    <Text size="sm" fontSize={14} textTransform="uppercase">
      Opacity:
    </Text>
    <Slider
      aria-label="slider-ex-1"
      min={0}
      max={1}
      step={0.1}
      value={opacity}
      onChange={handler}
      mr={2}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
    <FiXCircle onClick={() => setIsOpen(false)} style={{ marginRight: -3, cursor: 'pointer' }} />
  </HStack>
);

OpacitySlider.propTypes = {
  ...sharedPropTypes,
  setIsOpen: PropTypes.func.isRequired,
};

const OpacityControl = props => {
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const buttonStyleProps = omit(props, 'opacity', 'handler');

  return (
    <Box {...buttonStyleProps}>
      {isOpen ? (
        <OpacitySlider opacity={props.opacity} handler={props.handler} setIsOpen={setIsOpen} />
      ) : (
        <Tooltip label={translation.adjustOpacity[locale]} placement="left" hasArrow>
          <IconButton
            size="sm"
            {...styleProps}
            icon={<FiLayers color="black" />}
            onClick={() => setIsOpen(true)}
          />
        </Tooltip>
      )}
    </Box>
  );
};

OpacityControl.propTypes = {
  ...sharedPropTypes,
};

export default OpacityControl;
