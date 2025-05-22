import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Box, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useLocale } from '../../hooks/useLocale';

const Breadcrumbs = ({ collection, title }) => {
  const { locale } = useLocale();
  return (
    <Box>
      <Link href={`/${locale}/iconography`}>Iconography</Link>
      <ChevronRightIcon name="ChevronRightIcon" mx={2} />
      {collection && (
        <>
          <Text as="span" textTransform="capitalize">
            <Link href={`/${locale}/iconography/${collection}`}>{collection}</Link>
          </Text>
          <ChevronRightIcon name="ChevronRightIcon" mx={2} />
        </>
      )}
      {collection && title && <Text as="span">{title}</Text>}
    </Box>
  );
};

Breadcrumbs.propTypes = {
  collection: PropTypes.string,
  title: PropTypes.string,
};

Breadcrumbs.defaultProps = {
  collection: null,
  title: null,
};

export default Breadcrumbs;
