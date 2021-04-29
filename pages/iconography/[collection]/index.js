import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Grid, Container, Heading } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Timeline from '../../../components/Timeline';
import ImageSearch from '../../../components/ImageSearch';
import ViewButtons from '../../../components/ViewButtons';
import ImageSort from '../../../components/ImageSort';
import ImageViewer from '../../../components/ImageViewer';

import { useImages } from '../../../providers/ImageContext';
import config from '../../../utils/config';

const Collection = ({ images, collection }) => {
  const [, dispatch] = useImages();
  useEffect(() => dispatch(['SET_ALL_IMAGES', images]), []);

  return (
    <>
      <Head title={collection} />
      <Header />
      <Container>
        <Breadcrumbs collection={collection} />
        <Heading textTransform="capitalize">{collection}</Heading>
      </Container>
      <Container>
        <Timeline min={1600} max={2020} />
        <Grid templateColumns="2fr 1fr 1fr" gap="50px" my={5}>
          <ImageSearch />
          <ImageSort />
          <ViewButtons />
        </Grid>
      </Container>
      <ImageViewer />
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
  const images = Documents.map(d => ({ ...d, collection: params.collection }));
  return { props: { images, ...params } };
}

Collection.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
};

export default Collection;
