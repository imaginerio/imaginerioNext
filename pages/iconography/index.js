import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { sortBy } from 'lodash';
import { Container, Heading, Box, Grid, Text } from '@chakra-ui/react';

import Head from '../../components/Head';
import Header from '../../components/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';

import config from '../../utils/config';

const Iconography = ({ collections }) => (
  <>
    <Head title="Iconography" />
    <Header />
    <Container maxW="5xl">
      <Breadcrumbs />
      <Heading>Iconography</Heading>
      <Grid py={5} templateColumns="1fr 1fr" columnGap="40px" rowGap="20px">
        {collections.map(collection => (
          <Link key={collection.url} href={`/iconography/${collection.url}`}>
            <Box shadow="md" width="100%" px={5} pb={5} cursor="pointer">
              <Box mx={-5}>
                <Image
                  src={`https://images.imaginerio.org/iiif-img/3/${collection.id}/square/500,500/0/default.jpg`}
                  height={500}
                  width={500}
                />
              </Box>
              <Heading size="lg" textTransform="capitalize">
                {collection.label}
              </Heading>
              <Text>{`${collection.length} items`}</Text>
            </Box>
          </Link>
        ))}
      </Grid>
    </Container>
    <Footer />
  </>
);

Iconography.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export async function getStaticProps() {
  let collections = await Promise.all(
    config.collections.map(c =>
      axios.get(`https://images.imaginerio.org/iiif/2/collection/${c}`).then(({ data }) => ({
        id: data.manifests[0]['@id'].match(/[^/]+(?=\/manifest)/)[0],
        length: data.manifests.length,
        label: data.label,
        url: c,
      }))
    )
  );

  collections = sortBy(collections, c => c.length * -1);

  return { props: { collections } };
}

export default Iconography;
