import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { Box } from '@chakra-ui/react';

import ImageRow from '../ImageList/ImageRow';

const Probe = ({ image, pos }) => (
  <Box pos="fixed" left={pos.x} top={pos.y} w="400px" bg="white" p={2} pointerEvents="none">
    <ImageRow probe {...omit(image, 'source')} rowWidth={400} rowHeight={80} />
  </Box>
);

Probe.propTypes = {
  image: PropTypes.shape().isRequired,
  pos: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

Probe.defaultProps = {};

export default Probe;
