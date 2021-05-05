import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Box, Heading, Link, Text } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';

export const ImageMeta = ({ creator, date, source }) => (
  <Box>
    {creator && (
      <Text variant="oneline">
        <b>Creator: </b>
        {creator}
      </Text>
    )}
    {date && (
      <Text variant="oneline">
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

export const ImageTitle = ({ ssid, title }) => (
  <Heading size="md" m={0} variant="oneline">
    <ImageLink ssid={ssid}>{title}</ImageLink>
  </Heading>
);

ImageTitle.propTypes = {
  ssid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export const ImageLink = ({ children, ssid }) => {
  const { asPath } = useRouter();
  const [{ useLinks, allImages }, dispatch] = useImages();
  if (useLinks) return <Link href={`${asPath}/${ssid}`}>{children}</Link>;
  return (
    <Box
      whiteSpace="nowrap"
      textOverflow="ellipsis"
      overflow="hidden"
      color="#1580D1"
      cursor="pointer"
      onClick={() => dispatch(['SET_SELECTED_IMAGE', allImages.find(i => i.ssid === ssid)])}
    >
      {children}
    </Box>
  );
};

ImageLink.propTypes = {
  ssid: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
