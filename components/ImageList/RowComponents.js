import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Heading, Text } from '@chakra-ui/react';

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

export const ImageTitle = ({ ssid, title }) => {
  const { asPath } = useRouter();
  return (
    <Heading size="md" m={0} variant="oneline">
      <Link href={`${asPath}/${ssid}`}>{title}</Link>
    </Heading>
  );
};

ImageTitle.propTypes = {
  ssid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
