import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Grid, Flex, Box, Heading, Text, Link } from '@chakra-ui/react';

import Head from '../components/Head';
import Timeline from '../components/Timeline';
import GridResizable from '../components/GridResizable';

const Atlas = ({ images }) => {
  const [dates, setDates] = useState([1600, 2020]);
  return (
    <>
      <Head title="Map" />
      <Grid h="90px" templateColumns="170px 1fr" p={4}>
        <Link href="/" display="inherit">
          <Flex alignItems="center" borderRight="1px solid #ccc" pr={5} mr={5}>
            <img
              src="/svg/rio-logo.svg"
              style={{ width: 150, cursor: 'pointer' }}
              alt="ImagineRio Logo"
            />
          </Flex>
        </Link>
        <Timeline min={1600} max={2020} handler={setDates} />
      </Grid>
      <Box h="calc(100vh - 90px)">
        <GridResizable>
          <Box backgroundColor="#FF0000" h="100%" w="100%" />
          <Box backgroundColor="#0000FF" h="100%" w="100%" />
        </GridResizable>
      </Box>
    </>
  );
};

Atlas.propTypes = {};

Atlas.defaultProps = {};

export async function getStaticProps({ params }) {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API}/documents`);
  const images = data.reduce(
    (memo, d) => [...memo, d.Documents.map(img => ({ ...img, type: d.title }))],
    []
  );
  return { props: { images, ...params } };
}

export default Atlas;
