import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Container, Heading, Text } from '@chakra-ui/react';

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

const Collection = ({ images, collection }) => {
  let height = 800;
  if (typeof window !== 'undefined') ({ height } = useWindowDimensions());

  const [activeImages, setActiveImages] = useState(images);
  const [largeRow, setLargeRow] = useState(true);

  const Row = ({ index, style }) => {
    if (index >= activeImages.length) {
      return (
        <div style={style}>
          <Footer />
        </div>
      );
    }

    if (largeRow) {
      return <ImageRow {...activeImages[index]} style={style} collection={collection} />;
    }
    return <ImageRowSmall {...activeImages[index]} style={style} collection={collection} />;
  };

  Row.propTypes = {
    index: PropTypes.number.isRequired,
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
        <ImageFilter
          images={images}
          handler={setActiveImages}
          sizeHandler={setLargeRow}
          size={largeRow}
        />
        <Text>{`${activeImages.length} images found`}</Text>
      </Container>
      {largeRow ? (
        <VariableSizeList
          key="large"
          itemCount={activeImages.length + 1}
          estimatedItemSize={210}
          height={height - 357}
          width="100%"
          itemSize={index => (index < activeImages.length ? 210 : 334)}
        >
          {Row}
        </VariableSizeList>
      ) : (
        <VariableSizeList
          key="small"
          itemCount={activeImages.length + 1}
          estimatedItemSize={90}
          height={height - 357}
          width="100%"
          itemSize={index => (index < activeImages.length ? 90 : 334)}
        >
          {Row}
        </VariableSizeList>
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
