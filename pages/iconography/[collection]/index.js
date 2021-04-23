import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Container, Heading, Text, Box, Link } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Footer from '../../../components/Footer';
import ImageFilter from '../../../components/ImageFilter';
import ImageRow from '../../../components/ImageRow';
import ImageRowSmall from '../../../components/ImageRowSmall';

import config from '../../../utils/config';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const VariableSizeList = dynamic(() => import('react-window').then(mod => mod.VariableSizeList), {
  ssr: false,
});
const FixedSizeGrid = dynamic(() => import('react-window').then(mod => mod.FixedSizeGrid), {
  ssr: false,
});

const Collection = ({ images, collection }) => {
  let height = 800;
  let width = 1000;
  if (typeof window !== 'undefined') ({ height, width } = useWindowDimensions());

  const [activeImages, setActiveImages] = useState(images);
  const [size, setSize] = useState('full');

  const Row = ({ index, style }) => {
    if (index >= activeImages.length) {
      return (
        <div style={style}>
          <Footer />
        </div>
      );
    }

    if (size === 'full') {
      return <ImageRow {...activeImages[index]} style={style} collection={collection} />;
    }
    return <ImageRowSmall {...activeImages[index]} style={style} collection={collection} />;
  };

  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.shape().isRequired,
  };

  const Grid = ({ rowIndex, columnIndex, style }) => {
    const index = rowIndex * 3 + columnIndex;
    if (index >= activeImages.length) {
      return (
        <div style={style}>
          <Footer />
        </div>
      );
    }
    const { title, thumbnail, ssid } = activeImages[index];
    return (
      <div style={style}>
        <Link href={`/iconography/${collection}/${ssid}`}>
          <Box
            w="260px"
            h="150px"
            backgroundImage={`url(${thumbnail})`}
            backgroundSize="cover"
            backgroundPosition="center"
            mx="20px"
          />
          <Text mx="20px" w="260px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
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

  const columns = Math.floor(width / 300);

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
      {size === 'full' && (
        <VariableSizeList
          key="large"
          itemCount={activeImages.length + 1}
          estimatedItemSize={210}
          height={height - 360}
          width="100%"
          itemSize={index => (index < activeImages.length ? 210 : 334)}
        >
          {Row}
        </VariableSizeList>
      )}
      {size === 'small' && (
        <VariableSizeList
          key="small"
          itemCount={activeImages.length + 1}
          estimatedItemSize={90}
          height={height - 360}
          width="100%"
          itemSize={index => (index < activeImages.length ? 90 : 334)}
        >
          {Row}
        </VariableSizeList>
      )}
      {size === 'grid' && (
        <Container maxW="5xl">
          <Box m="auto" width={300 * columns}>
            <FixedSizeGrid
              height={height - 360}
              width={300 * columns}
              columnWidth={300}
              columnCount={columns}
              rowCount={Math.ceil(activeImages.length / columns)}
              rowHeight={210}
            >
              {Grid}
            </FixedSizeGrid>
          </Box>
        </Container>
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
