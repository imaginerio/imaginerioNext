import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { sortBy } from 'lodash';
import { Container, Heading, Box, Grid, Text } from '@chakra-ui/react';

import Head from '../../components/Head';
import Header from '../../components/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';

const Iconography = ({ collections }) => {
  const { locale } = useRouter();
  return (
    <>
      <Head title="Iconography" />
      <Header />
      <Container>
        <Breadcrumbs />
        <Heading>Iconography</Heading>
        <Grid pt={5} pb={24} templateColumns={['1fr', '1fr 1fr']} columnGap="40px" rowGap="20px">
          {collections.map(collection => (
            <Link key={collection.url} href={`${locale}/iconography/${collection.url}`}>
              <Box shadow="md" width="100%" px={5} pb={5} cursor="pointer" role="group">
                <Box
                  mx={-5}
                  w="calc(100% + 2.5rem)"
                  h="250px"
                  bgImage={`url(${collection.thumbnail.url})`}
                  bgSize="cover"
                  bgPosition="center"
                />
                <Heading
                  size="lg"
                  textTransform="capitalize"
                  _groupHover={{ textDecoration: 'underline' }}
                >
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
};

Iconography.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export async function getStaticProps() {
  let collections = await axios
    .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/documents`)
    .then(({ data }) =>
      Promise.all(
        data.map(d =>
          axios
            .get(`${process.env.NEXT_PUBLIC_IIIF}/collection/${d.title.toLowerCase()}.json`)
            .then(({ data: { thumbnail } }) => ({
              id: d.Documents[0].ssid,
              url: d.title.toLowerCase(),
              label: d.title,
              length: d.Documents.length,
              thumbnail: {
                url: thumbnail[0].id,
                width: thumbnail[0].set_width,
                height: thumbnail[0].set_height,
              },
            }))
        )
      )
    );

  collections = sortBy(collections, c => c.length * -1);

  return { props: { collections } };
}

export default Iconography;
