import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  HStack,
  IconButton,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';

const styleProps = {
  boxShadow: 'md',
  border: '1px solid #ccc',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
};

const OpacityControl = props => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonStyleProps = omit(props, 'opacity', 'handler');

  return (
    <Box {...buttonStyleProps}>
      {isOpen ? (
        <HStack {...styleProps} w={300} h="30px" px="10px">
          <Text size="sm" fontSize={14} textTransform="uppercase">
            Opacity:
          </Text>
          <Slider
            aria-label="slider-ex-1"
            min={0}
            max={1}
            step={0.1}
            value={props.opacity}
            onChange={props.handler}
            mr={2}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <FontAwesomeIcon
            icon={faTimesCircle}
            onClick={() => setIsOpen(false)}
            style={{ marginRight: -3, cursor: 'pointer' }}
          />
        </HStack>
      ) : (
        <IconButton
          size="sm"
          {...styleProps}
          icon={<FontAwesomeIcon icon={faLayerGroup} color="black" />}
          onClick={() => setIsOpen(true)}
        />
      )}
    </Box>
  );
};

OpacityControl.propTypes = {
  opacity: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
};

export default OpacityControl;
