/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { isArray } from 'lodash';
import Link from 'next/link';
import { Box, Heading, Text } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import translation from '../../assets/config/translations';

export const ImageMeta = ({ creator, date, source }) => {
  const { locale } = useRouter();
  let links;
  if (source && source.link) {
    links = [];
    if (isArray(source.link)) {
      source.link.forEach((link, i) => {
        links.push({ link: source.link[i], name: source.value[i] });
      });
    } else {
      links.push({ link: source.link, name: source.value });
    }
  }

  return (
    <Box>
      {creator && (
        <Text variant="oneline">
          <b>{`${translation.creator[locale]}: `}</b>
          {creator}
        </Text>
      )}
      {date && (
        <Text variant="oneline">
          <b>{`${translation.date[locale]}: `}</b>
          {date}
        </Text>
      )}
      {source && (
        <Text variant="oneline">
          <b>{`${translation.source[locale]}: `}</b>
          {links.map(({ link, name }) => (
            <Text as="span" key={name} mr={3}>
              <Link href={link} target="_blank">
                {name || link}
              </Link>
            </Text>
          ))}
        </Text>
      )}
    </Box>
  );
};

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
    <ImageLink
      ssid={ssid}
      whiteSpace="nowrap"
      textOverflow="ellipsis"
      overflow="hidden"
      color="#1580D1"
    >
      {title}
    </ImageLink>
  </Heading>
);

ImageTitle.propTypes = {
  ssid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export const ImageLink = ({ children, ssid, ...rest }) => {
  const { asPath, locale } = useRouter();
  const [{ useLinks, allImages }, dispatch] = useImages();
  if (useLinks)
    return (
      <Link href={`/${locale}${asPath}/${ssid}`}>
        <a style={{ width: '100%', height: '100%' }}>{children}</a>
      </Link>
    );
  return (
    <Box
      {...rest}
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
