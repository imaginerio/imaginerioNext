import React from 'react';
import PropTypes from 'prop-types';
import NextHead from 'next/head';
import GoogleFonts from 'next-google-fonts';

const Head = ({ title }) => (
  <>
    <GoogleFonts href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />
    <NextHead>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      <title>{title}</title>
    </NextHead>
  </>
);

Head.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Head;
