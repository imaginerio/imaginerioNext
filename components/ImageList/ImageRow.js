import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Container, Grid, Flex, Box } from '@chakra-ui/react';

import { ImageMeta, ImageTitle } from './RowComponents';

const calcImageSize = ({ rawWidth, rawHeight }) => {
  let imgHeight = 150;
  let imgWidth = 300;
  if (rawWidth) imgWidth = Math.round((150 / rawHeight) * rawWidth);
  if (imgWidth > 400) {
    imgWidth = 400;
    if (rawHeight) imgHeight = Math.round((400 / rawWidth) * rawHeight);
  }
  return {
    imgWidth,
    imgHeight,
  };
};

const ImageRow = ({
  style,
  collection,
  ssid,
  title,
  width: rawWidth,
  height: rawHeight,
  creator,
  date,
  source,
  thumbnail,
}) => {
  const { imgWidth, imgHeight } = calcImageSize({ rawWidth, rawHeight });
  return (
    <div style={style}>
      <Container maxW="5xl">
        <Grid
          templateColumns={`minmax(0, 1fr) ${imgWidth ? `${imgWidth}px` : '40%'}`}
          columnGap="40px"
          key={ssid}
          pb="30px"
          mb="30px"
          minH="150px"
          borderBottom="1px solid rgba(0,0,0,0.1)"
        >
          <Flex flexDirection="column" justifyContent="center">
            <ImageTitle collection={collection} ssid={ssid} title={title} />
            <Box h={4} />
            <ImageMeta creator={creator} date={date} source={source} />
          </Flex>
          <Flex align="center" justify="flex-end">
            <Box w={`${imgWidth}px`} h={`${imgHeight}px`}>
              <Image src={thumbnail} height={imgHeight} width={imgWidth} />
            </Box>
          </Flex>
        </Grid>
      </Container>
    </div>
  );
};

ImageRow.propTypes = {
  style: PropTypes.shape().isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  thumbnail: PropTypes.string.isRequired,
  ...ImageMeta.propTypes,
  ...ImageTitle.propTypes,
};

ImageRow.defaultProps = {
  width: null,
  height: null,
  ...ImageMeta.defaultProps,
};

export default ImageRow;
