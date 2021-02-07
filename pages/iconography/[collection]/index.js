import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Container, Grid, Flex, Box, Heading, Text } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Footer from '../../../components/Footer';

import { iiif, findByLabel } from '../../../utils/iiif';
import config from '../../../utils/config';

const Collection = ({ images, collection }) => (
  <>
    <Head title={collection} />
    <Header />
    <Container maxW="5xl">
      <Breadcrumbs collection={collection} />
      <Heading textTransform="capitalize">{collection}</Heading>
      {images.map(img => {
        const id = findByLabel(img, 'Identifier');
        const dim = findByLabel(img, 'Dimensions');
        let height = 150;
        let width = Math.round((150 / dim[1]) * dim[0]);
        if (width > 400) {
          width = 400;
          height = Math.round((400 / dim[0]) * dim[1]);
        }
        return (
          <Grid
            templateColumns={`1fr ${width}px`}
            columnGap="40px"
            key={id}
            pb="30px"
            mb="30px"
            borderBottom="1px solid rgba(0,0,0,0.1)"
          >
            <Box>
              <Heading size="md">
                <Link href={`/iconography/${collection}/${id}`}>
                  {findByLabel(img, 'Title') || 'Image'}
                </Link>
              </Heading>
              <Text>{findByLabel(img, 'Creator')}</Text>
              <Text>{findByLabel(img, 'Date (Circa)')}</Text>
            </Box>
            <Flex align="center">
              <Box w={`${width}px`} h={`${height}px`}>
                <Image
                  // eslint-disable-next-line prettier/prettier
                  src={`https://images.imaginerio.org/iiif-img/3/${id}/full/!300,150/0/default.jpg`}
                  height={height}
                  width={width}
                />
              </Box>
            </Flex>
          </Grid>
        );
      })}
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
    axios.get(`https://images.imaginerio.org/iiif/3/${id}/manifest`).then(({ data }) => {
      const metadata = iiif(data.metadata);
      const { width, height } = data.items[0];
      metadata.push({ label: 'Dimensions', value: [width, height] });
      return metadata;
    });

  const {
    data: { manifests },
  } = await axios.get(`https://images.imaginerio.org/iiif/2/collection/${params.collection}`);

  const images = [];
  await manifests.reduce(async (previousPromise, m) => {
    await previousPromise;
    // eslint-disable-next-line no-console
    console.log('Loading ', m['@id'].match(/[^/]+(?=\/manifest)/)[0]);
    return loadManifest(m['@id'].match(/[^/]+(?=\/manifest)/)[0]).then(i => images.push(i));
  }, Promise.resolve());
  return { props: { images, ...params } };
}

Collection.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
};

export default Collection;
