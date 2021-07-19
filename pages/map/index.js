import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Grid, Flex, Box, Link } from '@chakra-ui/react';

import Head from '../../components/Head';
import Timeline from '../../components/Timeline';
import GridResizable from '../../components/GridResizable';
import ImageController from '../../components/ImageController';

import { useImages } from '../../providers/ImageContext';
import useWindowDimensions from '../../utils/useWindowDimensions';

const AtlasController = dynamic(() => import('../../components/AtlasController'), { ssr: false });

const Atlas = ({ images }) => {
  let height = 800;
  let width = 1000;
  if (typeof window !== 'undefined') ({ height, width } = useWindowDimensions());
  height -= 90;

  const [, dispatch] = useImages();
  useEffect(() => {
    dispatch(['SET_ALL_IMAGES', images]);
    dispatch(['SET_USE_LINKS', false]);
  }, []);

  const [imageWidth, setImageWidth] = useState(500);

  useEffect(() => {
    if (imageWidth <= 400) {
      dispatch(['SET_SIZE', 'grid']);
    }
  }, [imageWidth]);

  return (
    <>
      <Head title="Map" />
      <Grid
        h="90px"
        pos="relative"
        templateColumns="170px 1fr"
        p={4}
        boxShadow="0 2px 3px rgba(0,0,0,0.15)"
        zIndex={12}
      >
        <Link href="/" display="inherit">
          <Flex alignItems="center" borderRight="1px solid #ccc" pr={5} mr={5}>
            <img
              src="/svg/rio-logo.svg"
              style={{ width: 150, cursor: 'pointer' }}
              alt="ImagineRio Logo"
            />
          </Flex>
        </Link>
        <Timeline min={1500} max={2020} triple />
      </Grid>
      <Box h="calc(100vh - 90px)">
        <GridResizable
          initialWidth={imageWidth}
          handler={setImageWidth}
          minWidth={200}
          maxWidth={width * 0.75}
        >
          <ImageController imageWidth={imageWidth} height={height} />
          <AtlasController width={width - imageWidth} height={height} />
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

export default React.memo(Atlas);
