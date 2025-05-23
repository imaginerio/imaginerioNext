import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import {
  Box,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';

import { ImageLink, MetaLinks } from '../ImageList/RowComponents';
import translation from '../../assets/config/translations';
import { useLocale } from '../../hooks/useLocale';

const FixedSizeGrid = dynamic(() => import('react-window').then(mod => mod.FixedSizeGrid), {
  ssr: false,
});

const ImageGrid = ({ width, height, activeImages }) => {
  const { locale } = useLocale();
  const numColumns = Math.floor(width / 185);
  const gridWidth = (width - 40) / numColumns;

  const Grid = ({ rowIndex, columnIndex, style }) => {
    const index = rowIndex * numColumns + columnIndex;
    const image = activeImages[index];
    if (!image) {
      return null;
    }
    const { ssid, title, thumbnail, creator, date } = image;

    return (
      <div style={style}>
        <ImageLink ssid={ssid}>
          <Popover trigger="hover">
            <PopoverTrigger>
              <Box pos="relative" w={`${gridWidth - 40}px`} h="150px" mx="20px" userSelect="none">
                {thumbnail && (
                  <Box
                    bgImage={`url(${thumbnail})`}
                    bgSize="contain"
                    w="full"
                    h="full"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                  />
                )}
              </Box>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Heading fontSize={18} mt={0} mb={2}>
                  {title}
                </Heading>
                {creator && (
                  <Text variant="oneline" fontSize={14}>
                    <b>{`${translation.creator[locale]}: `}</b>
                    <MetaLinks source={creator} />
                  </Text>
                )}
                {date && (
                  <Text variant="oneline" fontSize={14}>
                    <b>{`${translation.date[locale]}: `}</b>
                    {date}
                  </Text>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
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
