import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dynamic from 'next/dynamic';
import parse from 'html-react-parser';
import { flatten } from 'lodash';
import { Container, Grid, Box, Heading, Text, Flex, Spacer } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Footer from '../../../components/Footer';
import Atlas from '../../../components/Atlas';
import { iiif, findByLabel } from '../../../utils/iiif';
import config from '../../../utils/config';

const Mirador = dynamic(() => import('../../../components/Mirador'), { ssr: false });

const ImageDetails = ({ metadata, collection, id }) => (
  <>
    <Head title={id} />
    <Header />
    <Container maxW="5xl">
      <Breadcrumbs collection={collection} title={findByLabel(metadata, 'Title')} />
      <Heading>{metadata.find(m => m.label === 'Title').value}</Heading>
      <Text mb="40px">
        <span>Indentifier: </span>
        <span style={{ opacity: 0.6 }}>{findByLabel(metadata, 'Identifier')}</span>
      </Text>
      <Mirador
        config={{
          id: 'mirador',
          window: {
            allowClose: false, // Configure if windows can be closed or not
            allowFullscreen: true, // Configure to show a "fullscreen" button in the WindowTopBar
            allowMaximize: false, // Configure if windows can be maximized or not
          },
          workspaceControlPanel: {
            enabled: false,
          },
          windows: [{ manifestId: `https://images.imaginerio.org/iiif/3/${id}/manifest` }],
          language: 'pt-br',
        }}
      />
      <Text my="80px">{metadata.find(m => m.label === 'Description').value}</Text>

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
                <Spacer />
                <Text align="right">{parse(m.value)}</Text>
              </Flex>
            ))}
        </Box>
      </Grid>
      <hr style={{ margin: '40px 0' }} />
      <Heading size="md">3D Viewer</Heading>
      <iframe
        title="Smapshot"
        src={`https://smapshot-beta.heig-vd.ch/owner/imaginerio/original_image/${id}/embed`}
        style={{ width: '100%', minHeight: 400, height: '40vh', marginBottom: 80 }}
      />
    </Container>
    <Footer />
  </>
);

export async function getStaticPaths() {
  const collectionRequests = config.collections.map(collection =>
    axios
      .get(`https://images.imaginerio.org/iiif/2/collection/${collection}`)
      .then(({ data: { manifests } }) =>
        manifests.map(manifest => ({
          params: {
            collection,
            id: manifest['@id'].match(/[^/]+(?=\/manifest)/)[0],
          },
        }))
      )
  );
  const paths = flatten(await Promise.all(collectionRequests));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Get metadata from IIIF v3 manifest

  let {
    data: { metadata },
  } = await axios.get(`https://images.imaginerio.org/iiif/3/${params.id}/manifest`);
  metadata = iiif(metadata);

  return { props: { metadata, ...params } };
}

ImageDetails.propTypes = {
  metadata: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default ImageDetails;
