import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Grid, Container, Flex, Box, Link } from '@chakra-ui/react';

import Head from '../components/Head';
import Timeline from '../components/Timeline';
import GridResizable from '../components/GridResizable';
import ImageSearch from '../components/ImageSearch';
import ViewButtons from '../components/ViewButtons';
import ImageViewer from '../components/ImageViewer';

import { useImages } from '../providers/ImageContext';
import useWindowDimensions from '../utils/useWindowDimensions';

const Atlas = ({ images }) => {
  let height = 800;
  let width = 1000;
  if (typeof window !== 'undefined') ({ height, width } = useWindowDimensions());
  height -= 170;

  const [, dispatch] = useImages();
  useEffect(() => dispatch(['SET_ALL_IMAGES', images]), []);

  const [imageWidth, setImageWidth] = useState(500);

  useEffect(() => {
    if (imageWidth <= 400) {
      dispatch(['SET_SIZE', 'grid']);
    }
  }, [imageWidth]);

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
        <Timeline min={1600} max={2020} />
      </Grid>
      <Box h="calc(100vh - 90px)">
        <GridResizable
          initialWidth={imageWidth}
          handler={setImageWidth}
          minWidth={200}
          maxWidth={width * 0.75}
        >
          <Box>
            {imageWidth >= 400 && (
              <Container>
                <Grid templateColumns="1fr 125px" gap={5} mb={2}>
                  <ImageSearch />
                  <ViewButtons />
                </Grid>
              </Container>
            )}
            <ImageViewer height={height} width={imageWidth} />
          </Box>
          <Box backgroundColor="#0000FF" h="100%" w="100%" />
        </GridResizable>
      </Box>
    </>
  );
};

Atlas.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export async function getStaticProps({ params }) {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API}/documents`);
  const images = data.reduce(
    (memo, d) => [
      ...memo,
      ...d.Documents.map(img => ({ ...img, collection: d.title.toLowerCase() })),
    ],
    []
  );
  return { props: { images, ...params } };
}

export default Atlas;
