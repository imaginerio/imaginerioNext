import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Container, Grid, Flex, Box } from '@chakra-ui/react';

import { ImageMeta, ImageTitle } from './RowComponents';

const calcImageSize = ({ rawWidth, rawHeight, rowWidth, rowHeight }) => {
  let imgHeight = rowHeight;
  let imgWidth = 300;
  const maxWidth = Math.floor(rowWidth / 4);
  if (rawWidth) imgWidth = Math.round((120 / rawHeight) * rawWidth);
  if (imgWidth > maxWidth) {
    imgWidth = maxWidth;
    if (rawHeight) imgHeight = Math.round((maxWidth / rawWidth) * rawHeight);
  }
  return {
    imgWidth,
    imgHeight,
  };
};

const ImageRow = ({
  style,
  rowWidth,
  rowHeight,
  ssid,
  title,
  width: rawWidth,
  height: rawHeight,
  creator,
  date,
  source,
  thumbnail,
  probe,
}) => {
  const { imgWidth, imgHeight } = calcImageSize({ rawWidth, rawHeight, rowWidth, rowHeight });
  return (
    <div style={style}>
      <Container>
        <Grid
          templateColumns={`minmax(0, 1fr) ${imgWidth ? `${imgWidth}px` : '40%'}`}
          columnGap="20px"
          key={ssid}
          pb={probe ? 0 : '19px'}
          mb={probe ? 0 : '20px'}
          h={`${rowHeight}px`}
          borderBottom={probe ? 'none' : '1px solid rgba(0,0,0,0.1)'}
          boxSizing="content-box"
        >
          <Flex flexDirection="column" justifyContent="center">
            <ImageTitle ssid={ssid} title={title} />
            <ImageMeta creator={creator} date={date} source={source} />
          </Flex>
          <Flex align="center" justify="flex-end">
            <Box w={`${imgWidth}px`} h={`${imgHeight}px`}>
              {thumbnail && (
                <Image src={thumbnail} height={imgHeight} width={imgWidth} layout="responsive" />
              )}
            </Box>
          </Flex>
        </Grid>
      </Container>
    </div>
  );
};

ImageRow.propTypes = {
  style: PropTypes.shape(),
  rowWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  thumbnail: PropTypes.string.isRequired,
  probe: PropTypes.bool,
  ...ImageMeta.propTypes,
  ...ImageTitle.propTypes,
};

ImageRow.defaultProps = {
  style: {},
  rowHeight: 120,
  width: null,
  height: null,
  probe: false,
  ...ImageMeta.defaultProps,
};

export default ImageRow;
