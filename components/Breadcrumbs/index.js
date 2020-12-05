import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Box, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

const Breadcrumbs = ({ collection, title }) => (
  <Box>
    <Link href="/iconography">Iconography</Link>
    <ChevronRightIcon name="ChevronRightIcon" mx={2} />
    {collection && (
      <>
        <Text as="span" textTransform="capitalize">
          <Link href={`/iconography/${collection}`}>{collection}</Link>
        </Text>
        <ChevronRightIcon name="ChevronRightIcon" mx={2} />
      </>
    )}
    {collection && title && <Text as="span">{title}</Text>}
  </Box>
);

Breadcrumbs.propTypes = {
  collection: PropTypes.string,
  title: PropTypes.string,
};

Breadcrumbs.defaultProps = {
  collection: null,
  title: null,
};

export default Breadcrumbs;
