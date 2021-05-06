/* eslint-disable react/prop-types */
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { config } from '@fortawesome/fontawesome-svg-core';
import { ImageContextProvider } from '../providers/ImageContext';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import '../components/Timeline/Timeline.css';
import '../components/Mirador/Mirador.css';
import '../components/AtlasController/AtlasController.css';

import theme from '../theme/theme';

config.autoAddCss = false;

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
