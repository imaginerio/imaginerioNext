import React from 'react';
import PropTypes from 'prop-types';
import { Container, Text, Flex, Spacer } from '@chakra-ui/react';

import ImageList from '../ImageList';
import ImageGrid from '../ImageGrid';

import { useImages } from '../../providers/ImageContext';

const ImageViewer = ({ width, height, control }) => {
  const [{ activeImages, size }] = useImages();

  return (
    <>
      <Container mb={2}>
        <Flex>
          <Text>{`${activeImages.length} images found`}</Text>
          <Spacer />
          {control}
        </Flex>
      </Container>
      {size === 'grid' ? (
        <ImageGrid width={width} height={height} activeImages={activeImages} />
      ) : (
        <ImageList width={width} height={height} size={size} activeImages={activeImages} />
      )}
    </>
  );
};

ImageViewer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  control: PropTypes.node,
};

ImageViewer.defaultProps = {
  control: null,
};

export default ImageViewer;
