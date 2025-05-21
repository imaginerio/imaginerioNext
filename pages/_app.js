/* eslint-disable react/prop-types */
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { ImageContextProvider } from '../providers/ImageContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'intro.js/introjs.css';

import '../components/AtlasController/Atlas.css';
import '../components/Timeline/Timeline.css';
import '../components/Mirador/Mirador.css';
import '../styles/global.css';

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
