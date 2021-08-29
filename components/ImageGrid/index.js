import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Box, Tooltip } from '@chakra-ui/react';

import { ImageLink } from '../ImageList/RowComponents';

const FixedSizeGrid = dynamic(() => import('react-window').then(mod => mod.FixedSizeGrid), {
  ssr: false,
});

const ImageGrid = ({ width, height, activeImages }) => {
  const numColumns = Math.floor(width / 185);
  const gridWidth = (width - 40) / numColumns;

  const Grid = ({ rowIndex, columnIndex, style }) => {
    const index = rowIndex * numColumns + columnIndex;
    const image = activeImages[index];
    if (!image) {
      return null;
    }

    return (
      <div style={style}>
        <ImageLink ssid={image.ssid}>
          <Tooltip label={image.title || 'Untitled'} hasArrow>
            <Box pos="relative" w={`${gridWidth - 40}px`} h="150px" mx="20px" userSelect="none">
              {image.thumbnail && <Image src={image.thumbnail} layout="fill" objectFit="contain" />}
            </Box>
          </Tooltip>
        </ImageLink>
      </div>
    );
  };
  Grid.propTypes = {
    rowIndex: PropTypes.number.isRequired,
    columnIndex: PropTypes.number.isRequired,
    style: PropTypes.shape().isRequired,
  };

  return (
    <Box m="auto" width={gridWidth * numColumns}>
      <FixedSizeGrid
        height={height}
        width={gridWidth * numColumns}
        columnWidth={gridWidth}
        columnCount={numColumns}
        rowCount={Math.ceil(activeImages.length / numColumns)}
        rowHeight={170}
      >
        {Grid}
      </FixedSizeGrid>
    </Box>
  );
};

ImageGrid.propTypes = {
  activeImages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default ImageGrid;
