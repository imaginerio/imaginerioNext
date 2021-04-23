/* eslint-disable react/prop-types */
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import '../components/Timeline/Timeline.css';

import theme from '../theme/theme';

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
