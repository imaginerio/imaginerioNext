/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import propTypes from 'prop-types';
import Image from 'next/image';
import axios from 'axios';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { Container, Grid, Box, Heading, Text, Button, Link } from '@chakra-ui/react';

import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';

import translations from '../assets/config/translations';

const ParsedContent = ({ content }) => parse(content);

const Home = ({ content: { map, iconography } }) => {
  const { locale } = useRouter();
  return (
    <Box overflowX="hidden">
      <Head title="imagineRio" />
      <Header />
      <Box as="section" backgroundColor="#F7F9FC" py={[5, 50]}>
        <Container maxW="100vw">
          <Grid
            pl="calc(50vw - 512px)"
            templateColumns={['1fr', null, 'min(360px, 35%) 1fr']}
            gap="60px"
          >
            <Box display="flex" alignItems="center">
              <Box>
                <Heading size="sm">{translations.map[locale]}</Heading>
                <Heading size="md">imagineRio</Heading>
                <Text my={10} as="div">
                  <ParsedContent content={map} />
                </Text>
                <Link href="/map">
                  <Button variant="homepage">{translations.viewMap[locale]}</Button>
                </Link>
              </Box>
            </Box>
            <Box
              maxW={960}
              minW={480}
              p="15px"
              bgColor="black"
              position="relative"
              borderRadius="15px"
              alignSelf="center"
            >
              <video autoPlay="autoplay" controls muted>
                <source src={`/video/imaginerio-demo-${locale}.webm`} type="video/webm" />
              </video>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box as="section" py={[5, 50]}>
        <Container>
          <Grid templateColumns={['1fr', '1fr 1fr']} columnGap="50px">
            <Box>
              <Heading size="sm">{translations.iconography[locale]}</Heading>
              <Heading size="md">
                {`${translations.views[locale]}, ${translations.maps[
                  locale
                ].toLowerCase()}, plans, ${translations.aerials[locale].toLowerCase()}`}
              </Heading>
              <Text my={10} as="div">
                <ParsedContent content={iconography} />
              </Text>
              <Link href="/iconography">
                <Button variant="homepage">{translations.browseIconografy[locale]}</Button>
              </Link>
              <Box my={[5, 10]}>
                <Image src="/img/image3.png" width={460} height={286} alt="imagineRio" />
              </Box>
              <Box my={[5, 10]}>
                <Image src="/img/image.png" width={460} height={460} alt="imagineRio" />
              </Box>
            </Box>
            <Box>
              <Image src="/img/image1.png" width={460} height={460} alt="imagineRio" />
              <Box my={[5, 10]}>
                <Image src="/img/image2.png" width={460} height={320} alt="imagineRio" />
              </Box>
              <Box my={[5, 10]}>
                <Image src="/img/image4.png" width={460} height={320} alt="imagineRio" />
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

Home.propTypes = {
  content: propTypes.shape({
    map: propTypes.string.isRequired,
    iconography: propTypes.string.isRequired,
  }).isRequired,
};

export default Home;

export async function getStaticProps({ params, locale }) {
  const pages = {
    en: {
      map: 'en-homepage-map/119',
      iconography: 'en-homepage-iconography/121',
    },
    pt: {
      map: 'pt-homepage-map/120',
      iconography: 'pt-homepage-iconography/122',
    },
  };
  const headers = {
    'Api-Key': process.env.NEXT_PUBLIC_PAGE_API,
    'Api-Username': 'system',
  };

  const {
    data: {
      post_stream: { posts: map },
    },
  } = await axios.get(`${process.env.NEXT_PUBLIC_PAGE_URL}${pages[locale].map}.json`, { headers });
  const {
    data: {
      post_stream: { posts: iconography },
    },
  } = await axios.get(`${process.env.NEXT_PUBLIC_PAGE_URL}${pages[locale].iconography}.json`, {
    headers,
  });
  return {
    props: { content: { map: map[0].cooked, iconography: iconography[0].cooked }, ...params },
  };
}
