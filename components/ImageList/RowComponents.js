import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Text, Link } from '@chakra-ui/react';

export const ImageMeta = ({ creator, date, source }) => (
  <Box>
    {creator && (
      <Text>
        <b>Creator: </b>
        {creator}
      </Text>
    )}
    {date && (
      <Text>
        <b>Date: </b>
        {date}
      </Text>
    )}
    {source && (
      <Text variant="oneline">
        <b>Source: </b>
        <Link href={source.link}>{source.value || source.link}</Link>
      </Text>
    )}
  </Box>
);

ImageMeta.propTypes = {
  creator: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  source: PropTypes.shape(),
};

ImageMeta.defaultProps = {
  creator: null,
  date: null,
  source: null,
};

export const ImageTitle = ({ collection, ssid, title }) => (
  <Heading size="md" m={0} variant="oneline">
    <Link href={`/iconography/${collection}/${ssid}`}>{title}</Link>
  </Heading>
);

ImageTitle.propTypes = {
  collection: PropTypes.string.isRequired,
  ssid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
