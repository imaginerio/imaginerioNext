import React from 'react';
import PropTypes from 'prop-types';
import { Container, Text } from '@chakra-ui/react';

import ImageList from '../ImageList';
import ImageGrid from '../ImageGrid';

import { useImages } from '../../providers/ImageContext';

const ImageViewer = ({ width, height }) => {
  const [{ activeImages, size }] = useImages();

  return (
    <>
      <Container>
        <Text>{`${activeImages.length} images found`}</Text>
      </Container>
      {size === 'grid' ? (
        <ImageGrid width={width} height={height} activeImages={activeImages} />
      ) : (
        <ImageList size={size} activeImages={activeImages} height={height} />
      )}
    </>
  );
};

ImageViewer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default ImageViewer;
