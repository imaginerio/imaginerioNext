import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Container, Grid, Box, Heading, Text, Flex, Spacer } from '@chakra-ui/react';
import { Atlas } from '@imaginerio/diachronic-atlas';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Footer from '../../../components/Footer';
import { findByLabel } from '../../../utils/iiif';
import config from '../../../utils/config';
import mapStyle from '../../../assets/style/style.json';
import pages from '../../../assets/config/pages';

const Mirador = dynamic(() => import('../../../components/Mirador'), { ssr: false });

const ImageDetails = ({ metadata, geojson, id, collection }) => {
  const year = parseInt(findByLabel(metadata, 'Date'), 10);
  const title = findByLabel(metadata, 'Title') || 'Untitled';
  const { latitude, longitude } = geojson.features[0].properties;
  const smapshot = findByLabel(metadata, 'Smapshot');
  return (
    <>
      <Head title={title} />
      <Header />
      <Container>
        <Breadcrumbs collection={collection} title={findByLabel(metadata, 'Title')} />
        <Heading>{title}</Heading>
        <Text mb="40px">
          <span>Indentifier: </span>
          <span style={{ opacity: 0.6 }}>{id}</span>
        </Text>
        <Mirador
          config={{
            id: 'mirador',
            window: {
              allowClose: false, // Configure if windows can be closed or not
              allowFullscreen: true, // Configure to show a "fullscreen" button in the WindowTopBar
              allowMaximize: false, // Configure if windows can be maximized or not
              allowTopMenuButton: false,
            },
            workspace: {
              showZoomControls: true,
              allowNewWindows: false,
            },
            workspaceControlPanel: {
              enabled: false,
            },
            windows: [{ manifestId: `https://images.imaginerio.org/iiif/3/${id}/manifest` }],
            language: 'pt-br',
          }}
          style={{ position: 'relative', width: '100%', minHeight: 500, height: '40vh' }}
        />
        <Text my="80px">{findByLabel(metadata, 'Description')}</Text>

        <Grid templateColumns="480px 1fr" columnGap="50px">
          <Atlas
            year={year}
            geojson={[
              {
                id,
                data: geojson,
                paint: { 'fill-color': 'rgba(0,0,0,0.25)' },
              },
            ]}
            activeBasemap={collection === 'views' ? null : id}
            width={480}
            height={360}
            mapStyle={mapStyle}
            viewport={{
              latitude,
              longitude,
              zoom: 15,
            }}
            rasterUrl={process.env.NEXT_PUBLIC_RASTER_URL}
          />
          <Box>
            <Heading size="sm">Properties</Heading>
            {metadata
              .filter(
                m => m.label !== 'Title' && m.label !== 'Identifier' && m.label !== 'Description'
              )
              .map(m => {
                let { link, value } = m;
                if (!Array.isArray(link)) link = [link];
                if (!Array.isArray(value)) value = [value];
                return (
                  <Flex key={m.label} py={5} borderBottom="1px solid rgba(0,0,0,0.1)">
                    <Text>{`${m.label}:`}</Text>
                    <Spacer />
                    <Text align="right">
                      {value.map((v, i) => (
                        <React.Fragment key={v}>
                          {link[i] ? (
                            <Link href={link[i]} target="_blank">
                              {v || link[i]}
                            </Link>
                          ) : (
                            v
                          )}
                          <br />
                        </React.Fragment>
                      ))}
                    </Text>
                  </Flex>
                );
              })}
          </Box>
        </Grid>
        {smapshot && (
          <>
            <hr style={{ margin: '40px 0' }} />
            <Heading size="md">3D Viewer</Heading>
            <iframe
              title="Smapshot"
              src={`https://smapshot-beta.heig-vd.ch/owner/imaginerio/original_image/${id}/embed`}
              style={{ width: '100%', minHeight: 500, height: '40vh', marginBottom: 80 }}
            />
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export async function getStaticPaths() {
  let paths = [];
  const getCollection = collection =>
    axios
      .get(`${process.env.NEXT_PUBLIC_SEARCH_API}/documents?visual=${collection}`)
      .then(({ data }) => {
        paths = [
          ...paths,
          ...Object.keys(pages).reduce(
            (memo, lang) => [
              ...memo,
              ...data[0].Documents.map(d => ({
                params: {
                  collection,
                  id: d.ssid,
                },
                locale: lang,
              })),
            ],
            []
          ),
        ];
        return Promise.resolve();
      });

  await config.collections.reduce(async (previousPromise, collection) => {
    await previousPromise;
    return getCollection(collection);
  }, Promise.resolve());

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { data: geojson } = await axios.get(
    `${process.env.NEXT_PUBLIC_SEARCH_API}/document/${params.id}`
  );
  const { data: metadata } = await axios.get(
    `${process.env.NEXT_PUBLIC_SEARCH_API}/metadata/${params.id}`
  );

  return { props: { metadata, geojson, ...params } };
}

ImageDetails.propTypes = {
  geojson: PropTypes.shape(),
  metadata: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

ImageDetails.defaultProps = {
  geojson: null,
};

export default ImageDetails;
