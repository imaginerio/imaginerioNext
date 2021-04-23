import React from 'react';
import PropTypes from 'prop-types';
import { Container, Box, Heading, Text, Link } from '@chakra-ui/react';

const ImageRowSmall = ({ style, collection, ssid, title, creator }) => (
  <div style={style}>
    <Container maxW="5xl" borderBottom="1px solid rgba(0,0,0,0.1)" pb={5} mb={5}>
      <Heading size="md" m={0} variant="oneline">
        <Link href={`/iconography/${collection}/${ssid}`}>
          {title.length > 150 ? `${title.substr(0, title.lastIndexOf(' ', 150))}...` : title}
        </Link>
      </Heading>
      <Box>
        {creator && (
          <Text>
            <b>Creator: </b>
            {creator}
          </Text>
        )}
      </Box>
    </Container>
  </div>
);

ImageRowSmall.propTypes = {
  style: PropTypes.shape().isRequired,
  collection: PropTypes.string.isRequired,
  ssid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  creator: PropTypes.string,
};

ImageRowSmall.defaultProps = {
  creator: null,
};

export default ImageRowSmall;
