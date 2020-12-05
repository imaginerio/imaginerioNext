import { extendTheme } from '@chakra-ui/react';

export default extendTheme({
  styles: {
    global: {
      a: {
        color: '#1580D1',
      },
    },
  },
  fonts: {
    body: 'Roboto, sans-serif',
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 'normal',
        my: '20px',
      },
      sizes: {
        lg: {
          fontSize: '32px',
        },
        sm: {
          textTransform: 'uppercase',
          opacity: 0.75,
          fontSize: '14px',
        },
      },
      defaultProps: {
        size: 'lg',
      },
    },
  },
});
