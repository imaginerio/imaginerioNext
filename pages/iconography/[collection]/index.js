import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Container, Heading, Text, Box, Link } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import ImageFilter from '../../../components/ImageFilter';
import ImageList from '../../../components/ImageList';

import config from '../../../utils/config';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const FixedSizeGrid = dynamic(() => import('react-window').then(mod => mod.FixedSizeGrid), {
  ssr: false,
});

const Collection = ({ images, collection }) => {
  let height = 800;
  let width = 1000;
  if (typeof window !== 'undefined') ({ height, width } = useWindowDimensions());

  const numColumns = Math.floor(width / 340);
  const gridWidth = (width - 40) / numColumns;

  const [activeImages, setActiveImages] = useState(images);
  const [size, setSize] = useState('full');

  const Grid = ({ rowIndex, columnIndex, style }) => {
    const index = rowIndex * 3 + columnIndex;
    const { title, thumbnail, ssid } = activeImages[index];
    return (
      <div style={style}>
        <Link href={`/iconography/${collection}/${ssid}`}>
          <Box
            w={`${gridWidth - 40}px`}
            h="150px"
            backgroundImage={`url(${thumbnail})`}
            backgroundSize="contain"
            backgroundRepeat="no-repeat"
            backgroundPosition="center"
            mx="20px"
          />
          <Text
            mx="20px"
            w={`${gridWidth - 40}px`}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            textAlign="center"
          >
            {title}
          </Text>
        </Link>
      </div>
    );
  };
  Grid.propTypes = {
    rowIndex: PropTypes.number.isRequired,
    columnIndex: PropTypes.number.isRequired,
    style: PropTypes.shape().isRequired,
  };

  return (
    <>
      <Head title={collection} />
      <Header />
      <Container maxW="5xl">
        <Breadcrumbs collection={collection} />
        <Heading textTransform="capitalize">{collection}</Heading>
      </Container>
      <Container maxW="5xl" pb={5}>
        <ImageFilter images={images} handler={setActiveImages} sizeHandler={setSize} size={size} />
        <Text>{`${activeImages.length} images found`}</Text>
      </Container>
      {size === 'grid' ? (
        <Box m="auto" width={gridWidth * numColumns}>
          <FixedSizeGrid
            height={height - 360}
            width={gridWidth * numColumns}
            columnWidth={gridWidth}
            columnCount={numColumns}
            rowCount={Math.ceil(activeImages.length / numColumns)}
            rowHeight={210}
          >
            {Grid}
          </FixedSizeGrid>
        </Box>
      ) : (
        <ImageList
          size={size}
          activeImages={activeImages}
          height={height}
          collection={collection}
        />
      )}
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: config.collections.map(collection => ({ params: { collection } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const {
    data: [{ Documents }],
  } = await axios.get(
    `${process.env.NEXT_PUBLIC_SEARCH_API}/documents?visual=${params.collection}`
  );
  return { props: { images: Documents, ...params } };
}

Collection.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
};

export default Collection;
