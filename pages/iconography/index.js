import React from 'react';
import Link from 'next/link';
import { Container, Heading, Box, VStack } from '@chakra-ui/react';

import Head from '../../components/Head';
import Header from '../../components/Header';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';

import config from '../../utils/config';

const Iconography = () => (
  <>
    <Head title="Iconography" />
    <Header />
    <Container maxW="5xl">
      <Breadcrumbs />
      <Heading>Iconography</Heading>
      <hr />
      <VStack>
        {config.collections.map(collection => (
          <Box key={collection}>
            <Heading size="md">
              <Link href={`/iconography/${collection}`}>{collection}</Link>
            </Heading>
          </Box>
        ))}
      </VStack>
    </Container>
    <Footer />
  </>
);

export default Iconography;
