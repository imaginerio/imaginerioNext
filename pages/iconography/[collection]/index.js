import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Grid, Box, Heading, Text } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Footer from '../../../components/Footer';

import iiif from '../../../utils/iiif';
import config from '../../../utils/config';

const Collection = ({ images, collection }) => (
  <>
    <Head title={collection} />
    <Header />
    <Container maxW="5xl">
      <Breadcrumbs collection={collection} />
      <Heading textTransform="capitalize">{collection}</Heading>
      {images.map(img => (
        <Grid
          templateColumns="1fr 150px"
          columnGap="40px"
          key={img.find(m => m.label === 'Identifier').value}
          pb="30px"
          mb="30px"
          borderBottom="1px solid rgba(0,0,0,0.1)"
        >
          <Box>
            <Heading size="md">
              <Link
                href={`/iconography/${collection}/${img.find(m => m.label === 'Identifier').value}`}
              >
                {img.find(m => m.label === 'Title').value}
              </Link>
            </Heading>
            <Text>{img.find(m => m.label === 'Description').value}</Text>
          </Box>
          <Box w="150px" h="150px" borderRadius="75px" overflow="hidden" pos="relative">
            <Image
              // eslint-disable-next-line prettier/prettier
              src={`https://images.imaginerio.org/iiif-img/3/${img.find(m => m.label === 'Identifier').value}/square/150,/0/default.jpg`}
              layout="fill"
              objectFit="contain"
            />
          </Box>
        </Grid>
      ))}
    </Container>
    <Footer />
  </>
);

export async function getStaticPaths() {
  return {
    paths: config.collections.map(collection => ({ params: { collection } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const loadManifest = id =>
    axios
      .get(`https://images.imaginerio.org/iiif/3/${id}/manifest`)
      .then(({ data: { metadata } }) => iiif(metadata));

  const {
    data: { items },
  } = await axios.get(`https://images.imaginerio.org/iiif/collection/${params.collection}`);

  const images = [];
  await items.reduce(async (previousPromise, m) => {
    await previousPromise;
    // eslint-disable-next-line no-console
    console.log('Loading ', m.id.match(/[^/]+(?=\/manifest)/)[0]);
    return loadManifest(m.id.match(/[^/]+(?=\/manifest)/)[0]).then(i => images.push(i));
  }, Promise.resolve());
  return { props: { images, ...params } };
}

Collection.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
};

export default Collection;
