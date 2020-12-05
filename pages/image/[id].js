import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import parse from 'html-react-parser';
import { Container, Grid, Box, Heading, Text, Flex, Spacer } from '@chakra-ui/react';

import Head from '../../components/Head';
import Header from '../../components/Header';
import Atlas from '../../components/Atlas';

import iiif from '../../utils/iiif';

const ImageDetails = ({ metadata, thumbnail }) => (
  <>
    <Head title={metadata.id} />
    <Header />
    <Container maxW="5xl">
      <Heading>{metadata.find(m => m.label === 'Title').value}</Heading>
      <Text>
        <span>Indentifier: </span>
        <span style={{ opacity: 0.6 }}>{metadata.find(m => m.label === 'Identifier').value}</span>
      </Text>
      <hr style={{ margin: '20px 0' }} />
      <Grid templateColumns="150px 1fr" columnGap="40px" mb="80px">
        <Box w="150px" h="150px" borderRadius="75px" overflow="hidden" pos="relative">
          <Image src={thumbnail} layout="fill" objectFit="contain"></Image>
        </Box>
        <Text>{metadata.find(m => m.label === 'Description').value}</Text>
      </Grid>

      <Grid templateColumns="480px 1fr" columnGap="50px">
        <Atlas year={1880} />
        <Box>
          <Heading size="sm">Properties</Heading>
          {metadata
            .filter(
              m => m.label !== 'Title' && m.label !== 'Identifier' && m.label !== 'Description'
            )
            .map(m => (
              <Flex key={m.label} py={5} borderBottom="1px solid rgba(0,0,0,0.1)">
                <Text>{m.label}</Text>
                <Spacer></Spacer>
                <Text align="right">{parse(m.value)}</Text>
              </Flex>
            ))}
        </Box>
      </Grid>
    </Container>
  </>
);

export async function getStaticPaths() {
  // Get identifiers from IIIF v2 collection manifest
  const {
    data: { manifests },
  } = await axios.get('https://images.imaginerio.org/iiif/2/collection/all');

  const paths = manifests.map(manifest => `/image/${manifest['@id'].match(/[^/]+(?=\/manifest)/)}`);

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Get metadata from IIIF v3 manifest

  let {
    data: { metadata },
  } = await axios.get(`https://images.imaginerio.org/iiif/3/${params.id}/manifest`);
  metadata = iiif(metadata);

  const thumbnail = `https://images.imaginerio.org/iiif-img/3/${params.id}/square/150,/0/default.jpg`;

  return { props: { metadata, thumbnail, ...params } };
}

export default ImageDetails;
