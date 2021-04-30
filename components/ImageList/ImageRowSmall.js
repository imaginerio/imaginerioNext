import React from 'react';
import PropTypes from 'prop-types';
import { Container, Box, Text } from '@chakra-ui/react';

import { ImageTitle } from './RowComponents';

const ImageRowSmall = ({ style, collection, ssid, title, creator }) => (
  <div style={style}>
    <Container borderBottom="1px solid rgba(0,0,0,0.1)" pb={5} mb={5}>
      <ImageTitle collection={collection} ssid={ssid} title={title} />
      <Box>
        <Text variant="oneline">
          <span>
            {creator && (
              <>
                <b>Creator: </b>
                {creator}
              </>
            )}
            &nbsp;
          </span>
        </Text>
      </Box>
    </Container>
  </div>
);

ImageRowSmall.propTypes = {
  style: PropTypes.shape().isRequired,
  creator: PropTypes.string,
  ...ImageTitle.propTypes,
};

ImageRowSmall.defaultProps = {
  creator: null,
};

export default ImageRowSmall;
