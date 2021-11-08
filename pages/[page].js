import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import parse from 'html-react-parser';
import { Container, Box } from '@chakra-ui/react';

import pages from '../assets/config/pages';

import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ParsedContent = ({ content }) => parse(content);

const About = ({ content, title }) => (
  <>
    <Head title={`imagineRio - ${title}`} />
    <Header />
    <Box as="section" backgroundColor="#F7F9FC" py={[2, 50]}>
      <Container maxW="6xl" px={12}>
        <ParsedContent content={content} />
      </Container>
    </Box>
    <Footer />
  </>
);

About.propTypes = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export async function getStaticPaths() {
  return {
    paths: Object.keys(pages).reduce(
      (memo, lang) => [
        ...memo,
        ...Object.keys(pages[lang]).map(page => ({ params: { page }, locale: lang })),
      ],
      []
    ),

    fallback: false,
  };
}

export async function getStaticProps({ params, locale }) {
  const {
    data: {
      post_stream: { posts },
    },
  } = await axios.get(`${process.env.NEXT_PUBLIC_PAGE_URL}${pages[locale][params.page].url}.json`, {
    headers: {
      'Api-Key': process.env.NEXT_PUBLIC_PAGE_API,
      'Api-Username': 'system',
    },
  });
  return {
    props: { content: posts[0].cooked, title: pages[locale][params.page].title, ...params },
  };
}

export default About;
