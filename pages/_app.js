/* eslint-disable react/prop-types */
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { ImageContextProvider } from '../providers/ImageContext';

import '../components/Timeline/Timeline.css';

import theme from '../theme/theme';

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ImageContextProvider>
        <Component {...pageProps} />
      </ImageContextProvider>
    </ChakraProvider>
  );
}

export default App;
