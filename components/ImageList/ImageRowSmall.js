import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Text } from '@chakra-ui/react';

import { ImageTitle, MetaLinks } from './RowComponents';
import translation from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const ImageRowSmall = ({ style, ssid, title, creator }) => {
  const { locale } = useLocale();

  return (
    <div style={style}>
      <Container borderBottom="1px solid rgba(0,0,0,0.1)" pb={5} mb={5}>
        <ImageTitle ssid={ssid} title={title} />
        <Box>
          <Text variant="oneline">
            <span>
              {creator && (
                <>
                  <b>{`${translation.creator[locale]}: `}</b>
                  <MetaLinks source={creator} />
                </>
              )}
              &nbsp;
            </span>
          </Text>
        </Box>
      </Container>
    </div>
  );
};

ImageRowSmall.propTypes = {
  style: PropTypes.shape().isRequired,
  creator: PropTypes.string,
  ...ImageTitle.propTypes,
};

ImageRowSmall.defaultProps = {
  creator: null,
};

export default ImageRowSmall;
