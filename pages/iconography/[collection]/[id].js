import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/pro-light-svg-icons';
import { Container, Grid, Box, Heading, Text, Flex, Spacer, Button, Stack } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Footer from '../../../components/Footer';
import { findByLabel } from '../../../utils/iiif';
import config from '../../../utils/config';
import pages from '../../../assets/config/pages';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const Mirador = dynamic(() => import('../../../components/Mirador'), { ssr: false });
const Atlas = dynamic(() => import('../../../components/AtlasController/AtlasSingle'), {
  ssr: false,
});

const ImageDetails = ({ metadata, geojson, id, collection }) => {
  const { properties } = geojson.features[0];
  let year = parseInt(findByLabel(metadata, 'Date'), 10);
  if (!year) year = parseInt(findByLabel(metadata, 'Temporal Coverage'), 10);
  if (!year) year = properties.firstyear;
  const title = findByLabel(metadata, 'Title') || properties.title || 'Untitled';
  const { latitude, longitude } = geojson.features[0].properties;
  const smapshot = findByLabel(metadata, 'Smapshot');

  let width = 480;
  if (typeof window !== 'undefined') width = Math.min(width, useWindowDimensions().width - 32);

  return (
    <>
      <Head title={title} />
      <Header />
      <Container>
        <Breadcrumbs collection={collection} title={findByLabel(metadata, 'Title')} />
        <Heading>{title}</Heading>
        <Text mb="40px">
          <span>Identifier: </span>
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
            windows: [{ manifestId: `${process.env.NEXT_PUBLIC_IIIF}/${id}/manifest.json` }],
            language: 'pt-br',
          }}
          style={{ position: 'relative', width: '100%', minHeight: 500, height: '40vh' }}
        />
        <Text my="80px">{findByLabel(metadata, 'Description')}</Text>

        <Grid templateColumns={['1fr', '480px 1fr']} columnGap="50px" mb={10}>
          <Stack mb={10}>
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
              width={width}
              height={360}
              viewport={{
                latitude,
                longitude,
                zoom: 15,
              }}
            />
            <Button
              as="a"
              href={`/map#${id}`}
              colorScheme="blue"
              rightIcon={<FontAwesomeIcon icon={faExternalLink} />}
            >
              View image in map
            </Button>
          </Stack>
          <Box>
            <Heading size="sm" display={['none', 'block']}>
              Properties
            </Heading>
            {metadata
              .filter(
                m =>
                  m.label !== 'Title' &&
                  m.label !== 'Identifier' &&
                  m.label !== 'Description' &&
                  m.label !== 'Smapshot'
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

export async function getStaticProps({ params, locale }) {
  const lang = locale === 'pt' ? 'pt-BR' : 'en';
  const { data: geojson } = await axios.get(
    `${process.env.NEXT_PUBLIC_SEARCH_API}/document/${params.id}`
  );
  let { data: metadata } = await axios.get(
    `${process.env.NEXT_PUBLIC_SEARCH_API}/metadata/${params.id}?lang=${lang}`
  );

  const attributes = process.env.NEXT_PUBLIC_ATTR_ORDER.split(',');
  metadata = metadata
    .filter(({ label }) => label.toLowerCase() !== 'height' && label.toLowerCase() !== 'width')
    .sort((a, b) => {
      let aIndex = attributes.indexOf(a.label.toLowerCase());
      let bIndex = attributes.indexOf(b.label.toLowerCase());
      if (aIndex === -1) aIndex = Infinity;
      if (bIndex === -1) bIndex = Infinity;
      return aIndex - bIndex;
    });

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
