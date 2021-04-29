import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Text, Box, Link } from '@chakra-ui/react';

const FixedSizeGrid = dynamic(() => import('react-window').then(mod => mod.FixedSizeGrid), {
  ssr: false,
});

const ImageGrid = ({ width, height, activeImages }) => {
  const numColumns = Math.floor(width / 340);
  const gridWidth = (width - 40) / numColumns;

  const Grid = ({ rowIndex, columnIndex, style }) => {
    const index = rowIndex * 3 + columnIndex;
    const { title, thumbnail, ssid, collection } = activeImages[index];
    return (
      <div style={style}>
        <Link href={`/iconography/${collection}/${ssid}`}>
          <Box
            w={`${gridWidth - 40}px`}
            h="150px"
            backgroundImage={`url(${thumbnail})`}
            backgroundSize="contain"
            backgroundRepeat="no-repeat"
            backgroundPosition="center"
            mx="20px"
          />
          <Text
            mx="20px"
            w={`${gridWidth - 40}px`}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            textAlign="center"
          >
            {title}
          </Text>
        </Link>
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
        height={height - 360}
        width={gridWidth * numColumns}
        columnWidth={gridWidth}
        columnCount={numColumns}
        rowCount={Math.ceil(activeImages.length / numColumns)}
        rowHeight={210}
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
