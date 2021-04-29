import React from 'react';
import { Container, Text } from '@chakra-ui/react';

import ImageList from '../ImageList';
import ImageGrid from '../ImageGrid';

import { useImages } from '../../providers/ImageContext';
import useWindowDimensions from '../../utils/useWindowDimensions';

const ImageViewer = () => {
  let height = 800;
  let width = 1000;
  if (typeof window !== 'undefined') ({ height, width } = useWindowDimensions());

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

ImageViewer.propTypes = {};

ImageViewer.defaultProps = {};

export default ImageViewer;
