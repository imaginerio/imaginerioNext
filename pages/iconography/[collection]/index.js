import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Container, Grid, Flex, Box, Heading, Text, Link } from '@chakra-ui/react';

import Head from '../../../components/Head';
import Header from '../../../components/Header';
import Breadcrumbs from '../../../components/Breadcrumbs';
import Footer from '../../../components/Footer';

import config from '../../../utils/config';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const VariableSizeList = dynamic(() => import('react-window').then(mod => mod.VariableSizeList), {
  ssr: false,
});

const Collection = ({ images, collection }) => {
  let height = 800;
  if (typeof window !== 'undefined') ({ height } = useWindowDimensions());

  const Row = ({ index, style }) => {
    if (index >= images.length) {
      return (
        <div style={style}>
          <Footer />
        </div>
      );
    }

    const {
      ssid,
      title,
      width: rawWidth,
      height: rawHeight,
      creator,
      date,
      source,
      thumbnail,
    } = images[index];
    let imgHeight = 150;
    let imgWidth = 300;
    if (rawWidth) imgWidth = Math.round((150 / rawHeight) * rawWidth);
    if (imgWidth > 400) {
      imgWidth = 400;
      if (rawHeight) imgHeight = Math.round((400 / rawWidth) * rawHeight);
    }
    return (
      <div style={style}>
        <Container maxW="5xl">
          <Grid
            templateColumns={`minmax(0, 1fr) ${imgWidth ? `${imgWidth}px` : '40%'}`}
            columnGap="40px"
            key={ssid}
            pb="30px"
            mb="30px"
            minH="150px"
            borderBottom="1px solid rgba(0,0,0,0.1)"
          >
            <Flex flexDirection="column" justifyContent="center">
              <Heading size="md" mt={0} variant="oneline">
                <Link href={`/iconography/${collection}/${ssid}`}>
                  {title.length > 150
                    ? `${title.substr(0, title.lastIndexOf(' ', 150))}...`
                    : title}
                </Link>
              </Heading>
              <Box>
                {creator && (
                  <Text>
                    <b>Creator: </b>
                    {creator}
                  </Text>
                )}
                {date && (
                  <Text>
                    <b>Date: </b>
                    {date}
                  </Text>
                )}
                {source && (
                  <Text variant="oneline">
                    <b>Source: </b>
                    <Link href={source.link}>{source.value || source.link}</Link>
                  </Text>
                )}
              </Box>
            </Flex>
            <Flex align="center" justify="flex-end">
              <Box w={`${imgWidth}px`} h={`${imgHeight}px`}>
                <Image src={thumbnail} height={imgHeight} width={imgWidth} />
              </Box>
            </Flex>
          </Grid>
        </Container>
      </div>
    );
  };

  Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.shape().isRequired,
  };

  return (
    <>
      <Head title={collection} />
      <Header />
      <Container maxW="5xl">
        <Breadcrumbs collection={collection} />
        <Heading textTransform="capitalize">{collection}</Heading>
      </Container>
      <VariableSizeList
        itemCount={images.length + 1}
        estimatedItemSize={210}
        height={height - 192}
        width="100%"
        itemSize={index => (index < images.length ? 210 : 334)}
      >
        {Row}
      </VariableSizeList>
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: config.collections.map(collection => ({ params: { collection } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const {
    data: [{ Documents }],
  } = await axios.get(
    `${process.env.NEXT_PUBLIC_SEARCH_API}/documents?visual=${params.collection}`
  );
  return { props: { images: Documents, ...params } };
}

Collection.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  collection: PropTypes.string.isRequired,
};

export default Collection;
