/* eslint-disable no-console */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/pro-light-svg-icons';
import {
  Container,
  Grid,
  Box,
  Heading,
  Text,
  Flex,
  Spacer,
  Button,
  Stack,
  HStack,
  Center,
  Spinner,
} from '@chakra-ui/react';

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

axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });
const fetcher = url => axios.get(url).then(r => r.data);

const ImageDetails = ({ metadata, id, collection }) => {
  const { locale } = useRouter();
  const { data: geojson } = useSWR(`${process.env.NEXT_PUBLIC_SEARCH_API}/document/${id}`, fetcher);
  const date = findByLabel(metadata, 'Date') || findByLabel(metadata, 'Data');
  let year = parseInt(date, 10);
  if (!year) year = parseInt(findByLabel(metadata, 'Temporal Coverage'), 10);
  const title = findByLabel(metadata, 'Title') || findByLabel(metadata, 'Título') || 'Untitled';

  const creator = findByLabel(metadata, 'Creator') || findByLabel(metadata, 'Autor');
  const smapshot = findByLabel(metadata, 'Smapshot');

  let width = 480;
  if (typeof window !== 'undefined') width = Math.min(width, useWindowDimensions().width - 32);

  useEffect(() => document.querySelector('body').classList.remove('no-scroll'), []);

  return (
    <>
      <Head title={title} />
      <Header />
      <Container>
        <Breadcrumbs collection={collection} title={findByLabel(metadata, 'Title')} />
        <Heading>{title}</Heading>
        <HStack mb="40px" spacing={8}>
          <Text>
            <span>Creator: </span>
            <span style={{ opacity: 0.6 }}>{creator}</span>
          </Text>
          <Text>
            <span>Date: </span>
            <span style={{ opacity: 0.6 }}>{date}</span>
          </Text>
        </HStack>
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
            language: locale === 'pt' ? 'pt-br' : 'en',
            availableLanguages: {
              'pt-br': 'Português',
              en: 'English',
            },
          }}
          style={{ position: 'relative', width: '100%', minHeight: 500, height: '40vh' }}
        />
        <Text my="80px">
          {findByLabel(metadata, 'Description') || findByLabel(metadata, 'Descrição')}
        </Text>

        <Grid templateColumns={['1fr', '480px 1fr']} columnGap="50px" mb={10}>
          <Stack mb={10}>
            {geojson ? (
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
                  latitude: geojson.features[0].properties.latitude,
                  longitude: geojson.features[0].properties.longitude,
                  zoom: 15,
                }}
              />
            ) : (
              <Center height={360} w={width}>
                <Spinner size="xl" />
              </Center>
            )}
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
            {[{ label: 'Identifier', value: id }, ...metadata]
              .filter(
                m =>
                  m.label !== 'Title' &&
                  m.label !== 'Description' &&
                  m.label !== 'Título' &&
                  m.label !== 'Descrição' &&
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
  try {
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

    return { props: { metadata, ...params } };
  } catch (e) {
    console.log(e);
    console.log(params.id, lang);
    return { notFound: true };
  }
}

ImageDetails.propTypes = {
  metadata: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default ImageDetails;
